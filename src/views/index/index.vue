<template>
  <div class="page-container"></div>
</template>

<script setup lang="ts">
import { UseSizes } from "./hooks/sizes";
import { NoteBoard } from "./note-board/note-board";
import { CreateText } from "./note-board/text";

let noteboard: NoteBoard;
const { sizes, OnResize } = UseSizes();

OnResize(() => {
  if (!noteboard) return;
  noteboard.SetSize(sizes.width, sizes.height);
});

OnResize(() => {
  if (noteboard) return;
  noteboard = new NoteBoard({
    el: ".page-container",
    width: sizes.width,
    height: sizes.height,
    backgroundAlpha: 0,
    antialias: true,
    resolution: window.devicePixelRatio,
  });
  noteboard.OnLoad(() => {
    for (let i = 0; i < 500; i++) {
      const randomX = Math.random();
      const randomY = Math.random();
      const text = CreateText();
      noteboard.AddChild(text);
      text.position.set(800 * 10 * randomX, 600 * 10 * randomY);
    }
    noteboard.SetSize(sizes.width, sizes.height);
  });
});
</script>

<style lang="less" scoped>
.page-container {
  background-color: #d0d4d6;
}
</style>
