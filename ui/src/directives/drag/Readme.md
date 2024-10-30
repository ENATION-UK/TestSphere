# 拖拽指令

用来使元素具有可拖拽移动功能，或者拖拽到别的元素中进行复制。

## 演示

#### 基础

```html
<div v-drag>可以自由拖动的元素</div>
```

#### 具有拷贝功能

> 需搭配v-drop使用

```html
<!-- 可以拷贝到任何可拖入元素上 -->
<div v-drag:copy></div>

<!-- 可以拷贝指定了值为attr的元素上 -->
<div v-drag:property.copy></div>
```
