"use strict";
const COMPONENT_ATTR = "path";
const COMPONENT_KEYWORDS = ["on", "remove"];

// listener queue to keep track of active component listeners
let listenerQueue = [];

const loadedComponents = [];

// constructor for
const createComponentEventListener = (name, event, callback) => ({
  name,
  event,
  callback,
});

// component object for intializers for components
const components = {
  // subscribe function for hooking onto component events
  // the reason why I am combining it in the same 'component' namespace is to
  // keep code simple and clean, even if it means that it excludes me from
  // creating a component named 'on'
  on: (componentName, event, callback) =>
    listenerQueue.push(
      createComponentEventListener(componentName, event, callback)
    ),

  remove: (selector) => {
    document.removeChild($(selector));
  },
};

function emitComponentEvent(componentName, event, args) {
  const deleteQueue = listenerQueue
    // gets all listeners targeting same component
    .filter((listener) => listener.name === componentName)
    // gets all listeners targeting same event
    .filter((listener) => listener.event === event)

    // calls callback for listener, if it returns nothing / false then the listener
    // is added to the delete queue
    .filter((listener) => !listener.callback.call(window, args));

  // deletes everything in deletion queue
  //
  listenerQueue = listenerQueue.filter(
    (listener) => !deleteQueue.includes(listener)
  );
}

// Component Loading ----------------------------------------------------------
function loadComponents() {
  $("component")
    // Selects all object with component selector
    .filter((_, ele) => ele.hasAttribute(COMPONENT_ATTR))

    // Execs for each component asyncly
    .each(async (_, ele) => {
      const path = ele.getAttribute(COMPONENT_ATTR);
      const componentName = path.split("/").pop();

      // protects against illegal component names
      if (COMPONENT_KEYWORDS.includes(componentName)) {
        throw new Error(`Reserved component name used: '${componentName}'`);
      }

      // Used to create default file locations
      const defaultFile = (filetype, wrapper) => [
        `${path}.${filetype}`,
        wrapper,
      ];

      // gets metadata json for component
      const meta = await $.get(`${path}.json`);

      const getFileQueue = () => {
        // if 'default' is set to true assume to look for all default files
        if (meta.default) {
          return [
            defaultFile("css", "style"),
            defaultFile("html", "html"),
            defaultFile("js", "script"),
          ];
        }

        const queue = [];

        // used to add things to queue
        const queued = (type, wrapper) => {
          const data = meta[type];

          // if sub metadata is empty
          if (data === null || data === undefined || data.length === 0) {
            return;
          }

          // if file is explicit
          if (typeof data === "string") {
            if (data === "default") {
              queue.push(defaultFile(type, wrapper));
              return;
            }

            // gets root folder
            const componentRoot = path.split("/").slice(0, -1).join("/");
            queue.push([`${componentRoot}/${data}.${type}`, wrapper]);
            return;
          }

          // if array of files
          data.forEach((file) => queue.push([`${file}.${type}`, wrapper]));
        };
        queued("css", "style");
        queued("html", "html");
        queued("js", "script");

        return queue;
      };

      /*
       * Loads all file extensions done in imperitive sense over declaritive
       * functional (my favourite) just because I need these to be loaded in
       * the correct order
       */

      const files = getFileQueue();

      let injected = "";

      // loops through each file in queue
      for (const [file, wrapper] of files) {
        const isCSS = file.endsWith(".css");
        if (isCSS) {
          // if already loaded the CSS then skip
          if (loadedComponents.includes(path)) continue;
          loadedComponents.push(path);
        }

        try {
          const data = await $.get(file);

          // wraps it in HTML
          const tag = `<${wrapper}>${data}</${wrapper}>`;

          // implements CSS immediately
          if (isCSS) {
            ele.innerHTML += tag;
            continue;
          }

          injected += tag;
        } catch {
          console.error(`Failed to locate component file ${file}`);
        }
      }

      // adds injected scripts all at once
      ele.innerHTML = injected + ele.innerHTML;
      ele.removeAttribute(COMPONENT_ATTR);

      // attempts to grab initializer function for the component
      const func = components[componentName];

      if (func) {
        const args = {};

        // gets all extra attributes on object component and passes to initializer function
        ele
          .getAttributeNames()
          .filter((name) => name != COMPONENT_ATTR)
          .map((name) => name.toLowerCase())
          .forEach((name) => (args[name] = ele.getAttribute(name)));

        // calls initializer functions and pass attributes as options
        func.call(ele, args);
      }

      // logs component to console
      console.log(`Component ${componentName} loaded`);

      emitComponentEvent(componentName, "mounted", { ele, $ele: $(ele) });
    });
}

loadComponents();
