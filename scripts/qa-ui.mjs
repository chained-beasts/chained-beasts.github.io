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
          lang:document.documentElement.lang
        };
      });
      const contextLabel=width+"px "+route;
      assert.equal(data.h1,1,contextLabel+" H1");
      assert.equal(data.main,1,contextLabel+" main landmark");
      assert.equal(data.footer,1,contextLabel+" footer count");
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
