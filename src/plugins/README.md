## Plugin System

Extends the ARK Desktop Wallet with features that are not built into the core.

```jsx
const MyPlugin = ({ onClick }) => <button onClick={onClick}>Fetch</button>;

export default (api) => {
	const fetchTransactions = async () => {
		const response = await api.http().get("https://dexplorer.ark.io/api/transactions");
		api.store().data().set("transactions", response.body());
	};

	api.events().on("deactivated", () => api.store().persist());
	api.launch().render(<MyPlugin onClick={fetch} />);
};
```

### API

The Plugin API provides methods for the plugin to interact with registered services.

### Manifest

Some properties must be defined in the `package.json` so that the user knows what is being used by the plugin.

```json
{
	"desktop-wallet": {
		"title": "My Plugin",
		"categories": ["exchange"],
		"permissions": ["HTTP", "STORE", "LAUNCH", "EVENTS"],
		"urls": ["https://dexplorer.ark.io"]
	}
}
```

### Permissions

The Plugin must be authorized by the user before boot, also as show above, the name of the service used must be specified in the metadata. Otherwise it will not be executed.

### Services

The Plugin Services make the communication between the plugin and the process, providing its own API for the plugin, and all related logic as components or functions to be implemented in the process if necessary.

### What plugins can do

-   Make http requests
-   Read information about wallets (non-sensitive data such as address and balance)
-   Listen to events triggered by the application
-   Ask the user to save and open files
-   Render custom components & views
-   Add new languages
-   Add custom themes

### Limitations

-   Styles cannot be defined by plain object due to proxies, but you can use the global injected component: `<Components.Box as="button" styled={{ backgroundColor: "red" }}>My Button</Components.Box>`

## Plugin API

### Launch

Render a main view to the plugin:

<details><summary>Methods</summary>

**`render(node: React.ReactNode): void`**

</details>

### Store

Utilities to persist data in storage.

<details><summary>Methods</summary>

**`data(): DataRepository`**

Repository with your data. Eg: `const result = api.store().data().get("cookie")`.

**`persist(): void`**

Call this manually when your data needs to be saved.

</details>

### File System

Utilities for interacting with the user's file system.

<details><summary>Methods</summary>

**`askUserToSaveFile(content: string, suggestedFileName: string): void`**

Open a dialog to ask the user to save a file with the content.

**`askUserToOpenFile(): string | undefined`**

Open a dialog to ask the user to open a file.

</details>

### Theme

Utilities to customize components and register new themes:

<details><summary>Methods</summary>

**`decorate(key: string, (OriginalComponent: React.ComponentType) => React.ReactNode): void`**

Overwrite or extend a component with your own.

</details>

### HTTP

Utitlies to send http requests.

<details><summary>Methods</summary>

**`create(): void`**

Creates a new instance, useful for defining your own isolated headers.

**`get(url: string, query: object): void`**

Sends a GET request to the url.

**`post(url: string, data: object): void`**

Sends a POST request to the url.

**`decorate(key: "options", (currentOptions: object)): void`**

Overwrite global options. Useful to implement a proxy.

</details>

## File System Loader

Simple as it looks, the loader will search for this structure to check for valid plugins.

```
plugins/
├─ my-custom-plugin/
│ ├─ index.js
│ └─ package.json
└─ explorer-plugin/
```

### Custom Entry

It is possible to use another entry file like from `dist/main.js`, just specify it in the `package.json`:

```json
{
	"name": "my-custom-plugin",
	"main": "dist/main.js"
}
```

## Transpilation

The entry file will be executed through a second VM (read more below), so there is no way to automatically transpile your code, if you want to use JSX, Typescript, Babel or others, it must be done in the build process.

[Preconstruct](https://github.com/preconstruct/preconstruct) should be enough for what you want, but there is also [Rollup](https://github.com/rollup/rollup) or [Webpack](https://github.com/webpack/webpack).

## Security

We have some "shields" to ensure that the plugin runs only if certain conditions are met, as introduced in the permissions section.

The source code of the entry file will be perfomed by an isolated and secure [sandbox](https://github.com/patriksimek/vm2), to prevent plugins from executing malicious code.

The user can also blacklist the plugin from being displayed or executed in any way.
