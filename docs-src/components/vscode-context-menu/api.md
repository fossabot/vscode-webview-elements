---
layout: component.njk
title: ContextMenu
tags: api
component: vscode-context-menu
---

<!-- This file is auto-generated. Do not edit! -->

# VscodeContextMenu

## Properties

| Property | Attribute | Type             | Default | Description                                      |
|----------|-----------|------------------|---------|--------------------------------------------------|
| `data`   | `data`    | `MenuItemData[]` | []      | <pre><code>interface MenuItemData {<br />&nbsp;&nbsp;label: string;<br />&nbsp;&nbsp;keybinding?: string;<br />&nbsp;&nbsp;value?: string;<br />&nbsp;&nbsp;separator?: boolean;<br />&nbsp;&nbsp;tabindex?: number;<br />}</code></pre> |
| `show`   | `show`    | `boolean`        | false   |                                                  |

## Events

| Event        | Type               |
|--------------|--------------------|
| `vsc-select` | `CustomEvent<any>` |
