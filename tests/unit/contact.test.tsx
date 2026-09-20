import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { NextIntlClientProvider } from "next-intl";
import { ContactActions } from "../../src/features/home/contact-actions";
import { messages } from "../../src/i18n/messages";
import { Toaster, toast } from "sonner";

test("contact button copies the supplied address and announces denied clipboard access", async () => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost",
    pretendToBeVisual: true,
  });
  Object.defineProperty(globalThis, "window", {
    value: dom.window,
    configurable: true,
  });
  Object.defineProperty(globalThis, "document", {
    value: dom.window.document,
    configurable: true,
  });
  Object.defineProperty(globalThis, "navigator", {
    value: dom.window.navigator,
    configurable: true,
  });
  Object.defineProperty(globalThis, "HTMLElement", {
    value: dom.window.HTMLElement,
    configurable: true,
  });
  Object.defineProperty(globalThis, "getComputedStyle", {
    value: dom.window.getComputedStyle,
    configurable: true,
  });
  Object.defineProperty(globalThis, "requestAnimationFrame", {
    value: dom.window.requestAnimationFrame.bind(dom.window),
    configurable: true,
  });
  Object.defineProperty(globalThis, "cancelAnimationFrame", {
    value: dom.window.cancelAnimationFrame.bind(dom.window),
    configurable: true,
  });
  Object.defineProperty(dom.window, "matchMedia", {
    value: () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }),
  });
  const { render, fireEvent, waitFor, cleanup } =
    await import("@testing-library/react");
  let copied = "";
  Object.defineProperty(dom.window.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async (text: string) => {
        copied = text;
      },
    },
  });
  const view = render(
    <NextIntlClientProvider
      locale="en"
      messages={messages.en}
      timeZone="Asia/Bangkok"
    >
      <ContactActions email="test@example.com" />
      <Toaster />
    </NextIntlClientProvider>,
  );
  fireEvent.click(view.getByRole("button", { name: "Copy email" }));
  await waitFor(() => assert.equal(copied, "test@example.com"));
  await waitFor(() => assert.ok(view.getByText("Email copied")));
  toast.dismiss();
  Object.defineProperty(dom.window.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async () => {
        throw new Error("Permission denied");
      },
    },
  });
  fireEvent.click(view.getByRole("button", { name: "Copy email" }));
  await waitFor(() => assert.ok(view.getByText(messages.en.home.copyFailed)));
  cleanup();
  dom.window.close();
});
