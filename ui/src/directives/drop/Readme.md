# 拽入指令

在使用v-drag.copy时的可放置元素上使用。

## 演示

#### 基础

```html
<div v-drop:property="handleDrop">可以拽入标识为attr的元素</div>

<script>
  const handleDrop = (data: string, ev: DragEvent) => {}
</script>
```
