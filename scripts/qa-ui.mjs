import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { chromium } from "playwright";

const base="http://127.0.0.1:8787";
const origin="https://chained-beasts.github.io";
const routes=["/","/patch-notes/","/beginner-guide/","/crossplay/","/solo-guide/","/afflictions/"];
const widths=[375,768,1440];
const screenshotDir=path.join(process.env.RUNNER_TEMP||os.tmpdir(),"chained-beasts-ui");
await mkdir(screenshotDir,{recursive:true});
const server=spawn("python3",["-m","http.server","8787","--bind","127.0.0.1","--directory","out"],{stdio:"ignore"});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let browser;
try{
  let ready=false;
  for(let i=0;i<60;i++){
    if(server.exitCode!==null)throw Error("Local server exited");
    try{const response=await fetch(base+"/");if(response.ok){ready=true;break}}catch{}
    await delay(200);
  }
  assert.ok(ready,"Static export unavailable");
  const chrome=["/usr/bin/google-chrome","/usr/bin/chromium-browser","/usr/bin/chromium"].find(existsSync);
  assert.ok(chrome,"Chromium browser not installed on CI runner");
  browser=await chromium.launch({headless:true,executablePath:chrome,args:["--no-sandbox","--disable-dev-shm-usage"]});
  let count=0;
  for(const width of widths){
    const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,colorScheme:"dark"});
    for(const route of routes){
      const page=await context.newPage();
      const adRequests=[];
      await page.route("https://bauval.org/**",async route=>{
        adRequests.push(route.request().url());
        await route.fulfill({status:200,contentType:"application/javascript",body:""});
      });
      const errors=[];
      page.on("pageerror",error=>errors.push(error.message));
      const response=await page.goto(base+route,{waitUntil:"load",timeout:30000});
      assert.equal(response?.status(),200,width+" "+route+" HTTP");
      const data=await page.evaluate(()=>{
        const faq=document.getElementById("faq");
        const footer=document.querySelector("footer.cb-footer");
        const main=document.querySelector("main");
        return {
          h1:document.querySelectorAll("h1").length,
          main:document.querySelectorAll("main").length,
          footer:document.querySelectorAll("footer.cb-footer").length,
          faqBeforeFooter:Boolean(faq&&footer&&(faq.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_FOLLOWING)),
          mainBeforeFooter:Boolean(main&&footer&&(main.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_FOLLOWING)),
          width:document.documentElement.scrollWidth,
          viewport:window.innerWidth,
          title:document.title,
          description:document.querySelector('meta[name="description"]')?.getAttribute("content")||"",
          canonical:document.querySelector('link[rel="canonical"]')?.getAttribute("href")||"",
          robots:document.querySelector('meta[name="robots"]')?.getAttribute("content")||"",
          links:[...document.querySelectorAll('header a[href^="/"], footer a[href^="/"]')].map(a=>new URL(a.href).pathname),
          brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute("src")),
          tables:document.querySelectorAll(".cb-table").length,
          contentChars:document.body.innerText.length,
          footerHeadingCount:footer?.querySelectorAll("h1,h2,h3,h4,h5,h6").length ?? -1,
          footerTitle:footer?.querySelector(".cb-footer-title")?.textContent?.trim()||"",
          cardSummaries:[...document.querySelectorAll(".section .cards .card")].map(card=>({
            heading:card.querySelector("h3")?.textContent?.trim()||"",
            excerpt:card.querySelector("p")?.textContent?.trim()||"",
            cardHeight:Math.round(card.getBoundingClientRect().height),
            url:card.querySelector("a")?.getAttribute("href")||""
          })),
          lang:document.documentElement.lang
        };
      });
      await page.waitForFunction(()=>
        document.querySelectorAll("[data-adsterra-banner-slot] iframe").length===1 &&
        document.querySelectorAll("[data-adsterra-native-slot] script").length===1 &&
        document.querySelectorAll('script[src="https://bauval.org/14/743c92d8ec9827850a3d2fe87040eac6"]').length===1
      ,{timeout:15000});
      const ads=await page.evaluate(()=>{
        const banner=document.querySelector("[data-adsterra-banner-slot]");
        const native=document.querySelector("[data-adsterra-native-slot]");
        const frame=banner?.querySelector("iframe");
        const main=document.querySelector("main");
        const hero=document.querySelector("section.hero");
        const status=document.querySelector(".template-inner-article .cb-status");
        const firstPara=document.querySelector(".template-inner-article .cb-content > section p");
        const guides=document.querySelector("section.section");
        const mobile=window.innerWidth<768;
        return {
          banners:document.querySelectorAll("[data-adsterra-banner-slot]").length,
          natives:document.querySelectorAll("[data-adsterra-native-slot]").length,
          socialScripts:document.querySelectorAll('script[src="https://bauval.org/14/743c92d8ec9827850a3d2fe87040eac6"]').length,
          nativeScripts:document.querySelectorAll('script[src="https://bauval.org/21/45a476f43739d044399f66b49b0101e4"]').length,
          frameType:frame?.getAttribute("data-banner-variant"),
          frameSrcdoc:frame?.getAttribute("srcdoc")||"",
          frameWidth:frame?.getAttribute("width"),
          frameHeight:frame?.getAttribute("height"),
          orderOnHome:Boolean(hero&&guides&&banner&&native&&
            (hero.compareDocumentPosition(banner)&Node.DOCUMENT_POSITION_FOLLOWING)&&
            (banner.compareDocumentPosition(guides)&Node.DOCUMENT_POSITION_FOLLOWING)&&
            (guides.compareDocumentPosition(native)&Node.DOCUMENT_POSITION_FOLLOWING)),
          orderOnInner:Boolean(status&&firstPara&&banner&&native&&
            (status.compareDocumentPosition(banner)&Node.DOCUMENT_POSITION_FOLLOWING)&&
            (banner.compareDocumentPosition(firstPara)&Node.DOCUMENT_POSITION_FOLLOWING)&&
            (firstPara.compareDocumentPosition(native)&Node.DOCUMENT_POSITION_FOLLOWING)),
          mainContainsBoth:Boolean(main?.contains(banner)&&main?.contains(native)),
          textUnchanged:!document.querySelector("[data-adsterra-native-slot] h1,[data-adsterra-banner-slot] h1"),
          mobile
        };
      });
      const expectedMobile="https://bauval.org/22/e840a64487e7f06b64f620a74ea2cb92";
      const expectedDesktop="https://bauval.org/22/86170cbce6d0ab83964c5231ab0f2d52";
      const contextLabel=width+"px "+route;
      assert.equal(ads.banners,1,contextLabel+" banner count");
      assert.equal(ads.natives,1,contextLabel+" native count");
      assert.equal(ads.socialScripts,1,contextLabel+" social singleton");
      assert.equal(ads.nativeScripts,1,contextLabel+" native script singleton");
      assert.equal(ads.frameType,width<768?"mobile":"desktop",contextLabel+" banner variant");
      assert.equal(ads.frameWidth,width<768?"320":"728",contextLabel+" banner width");
      assert.equal(ads.frameHeight,width<768?"50":"90",contextLabel+" banner height");
      assert.ok(ads.frameSrcdoc.includes(width<768?expectedMobile:expectedDesktop),contextLabel+" official banner GET CODE");
      assert.ok(!ads.frameSrcdoc.includes(width<768?expectedDesktop:expectedMobile),contextLabel+" banner wrong device script");
      assert.ok(ads.mainContainsBoth,contextLabel+" ads should stay inside main");
      assert.ok(route==="/"?ads.orderOnHome:ads.orderOnInner,contextLabel+" ad placement order");
      assert.ok(ads.textUnchanged,contextLabel+" ad must not add SEO heading");
      // External scripts and srcdoc frames may finish after React has created their nodes.
      for(let tick=0;tick<25&&adRequests.length<3;tick++) await page.waitForTimeout(160);
      console.log("AD_REQUESTS",contextLabel,JSON.stringify(adRequests));
      for(const src of [width<768?expectedMobile:expectedDesktop,
        "https://bauval.org/21/45a476f43739d044399f66b49b0101e4",
        "https://bauval.org/14/743c92d8ec9827850a3d2fe87040eac6"]){
        assert.equal(adRequests.filter(s=>s===src).length,1,contextLabel+" exactly one ad request: "+src);
      }
      assert.equal(adRequests.filter(s=>s===(width<768?expectedDesktop:expectedMobile)).length,0,contextLabel+" no other banner request");
      assert.equal(data.h1,1,contextLabel+" H1");
      assert.equal(data.main,1,contextLabel+" main landmark");
      assert.equal(data.footer,1,contextLabel+" footer count");
      assert.equal(data.footerHeadingCount,0,contextLabel+" footer must not contain article headings");
      assert.equal(data.footerTitle,"Chained Beasts Wiki",contextLabel+" footer brand text");
      if(route==="/"){
        assert.equal(data.cardSummaries.length,5,contextLabel+" exactly five primary guide cards");
        for(const card of data.cardSummaries){
          assert.ok(card.heading.length>3,contextLabel+" card heading");
          assert.ok(card.excerpt.length>=70,contextLabel+" card excerpt too short: "+card.heading);
          assert.notEqual(card.heading.toLowerCase(),card.excerpt.toLowerCase(),contextLabel+" duplicated title: "+card.heading);
          assert.ok(card.cardHeight<300,contextLabel+" oversized guide card: "+card.heading+" height="+card.cardHeight);
          assert.ok(routes.includes(card.url),contextLabel+" invalid card link "+card.url);
        }
      }
      assert.ok(data.faqBeforeFooter&&data.mainBeforeFooter,contextLabel+" footer must be after FAQ and main");
      assert.ok(data.width<=data.viewport+3,contextLabel+" horizontal overflow "+data.width+"/"+data.viewport);
      assert.ok(data.title.length>8&&data.title.length<=60,contextLabel+" title");
      assert.ok(data.description.length>30&&data.description.length<=160,contextLabel+" description");
      assert.equal(data.canonical,origin+route,contextLabel+" canonical");
      assert.ok(!/noindex/i.test(data.robots),contextLabel+" indexing disabled");
      assert.equal(data.lang,"en",contextLabel+" language");
      assert.ok(data.contentChars>3000,contextLabel+" content absent");
      assert.ok(data.tables>=1,contextLabel+" table absent");
      assert.deepEqual(data.brokenImages,[],contextLabel+" broken images");
      for(const expected of routes)assert.ok(data.links.includes(expected),contextLabel+" global navigation missing "+expected);
      assert.deepEqual(errors,[],contextLabel+" browser errors");
      if(route==="/" || (width===375&&route==="/patch-notes/") || (width===1440&&route==="/crossplay/")){
        const name=route==="/"?"home":route.replace(/^\/|\/$/g,"").replaceAll("/","-");
        await page.screenshot({path:path.join(screenshotDir,name+"-"+width+".png"),fullPage:true,animations:"disabled"});
      }
      console.log("PASS",contextLabel,"chars="+data.contentChars,"tables="+data.tables);
      count++;
      await page.close();
    }
    await context.close();
  }
  console.log("UI verified:",count,"viewport/page combinations",widths);
} finally{
  if(browser)await browser.close();
  server.kill("SIGTERM");
}
