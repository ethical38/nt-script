// ==UserScript==
// @name         NJIT Registration Spring 2024 - Straight to Plans
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://reg-prod.ec.njit.edu/StudentRegistrationSsb/ssb/registration
// @match        https://reg-prod.ec.njit.edu/StudentRegistrationSsb/ssb/term/*
// @match        https://reg-prod.ec.njit.edu/StudentRegistrationSsb/ssb/classRegistration/classRegistration
// @icon         https://www.google.com/s2/favicons?sz=64&domain=njit.edu
// @grant        none
// @run-at       document-start
// ==/UserScript==

const url = new URL(window.location.href);
const pathname = url.pathname;
const parts = pathname.split("/");

// Get last portion
const termSelection = parts.pop();

const params = url.searchParams;

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkElementExists_ID(selector) {
  while (true) {
    let element = document.getElementById(selector);

    if (element) {
      return element;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

async function checkElementExists_Query(selector) {
  while (true) {
    let element = document.querySelector(selector);

    if (element) {
      return element;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

async function register_classes_nav() {
  console.log("Start");
  await wait(500);

  console.log("Waiting 500ms...");
  let registerBtn = document.getElementById("registerLink");

  registerBtn.click();
}

async function select_term() {
  await wait(500);
  const spring_id = "202410";
  //spring_id = "202395"
  const text = "2024 Spring";
  //text = "2023-2024 Winter";

  let text_elem = await checkElementExists_ID("select2-chosen-1");
  let input = await checkElementExists_ID("txt_term");
  let btn = await checkElementExists_ID("term-go");
  text_elem.innerText = text;
  input.value = spring_id;
  input.setAttribute("data-init-text", spring_id);
  input.setAttribute("listofsearchterms", spring_id);
  await wait(200);
  btn.click();

  //if time issue
  let interval;
  let timeErrorBtn = await checkElementExists_Query(
    "#notification-center > div > ul.error-container > li > div.notification-item-prompts > button"
  );
  if (timeErrorBtn) {
    await wait(200);
    timeErrorBtn.click();
    interval = setInterval(async () => {
      text_elem.innerText = text;
      input.value = spring_id;
      input.setAttribute("data-init-text", spring_id);
      input.setAttribute("listofsearchterms", spring_id);
      //await wait(200)
      btn.click();
      timeErrorBtn = await checkElementExists_Query(
        "#notification-center > div > ul.error-container > li > div.notification-item-prompts > button"
      );
      await wait(50);
      timeErrorBtn.click();
    }, 900);
  }
}

async function open_plans() {
  await wait(1000);
  let loadPlanBtn = await checkElementExists_ID("loadPlans-tab");
  loadPlanBtn.click();
}

if (termSelection == "registration") {
  register_classes_nav();
}

if (termSelection == "termSelection") {
  select_term();
}

if (termSelection == "classRegistration") {
  open_plans();
}
