import { onMounted, onUnmounted, reactive } from "vue";

export const UseSizes = () => {
  const onResizeFns: (() => void)[] = [];

  const sizes = reactive({
    width: 0,
    height: 0,
  });

  const Resize = () => {
    sizes.width = document.body.clientWidth;
    sizes.height = document.body.clientHeight;
    onResizeFns.forEach((fn) => fn());
  };

  const OnResize = (fn: () => void) => {
    onResizeFns.push(fn);
  };

  onMounted(() => {
    Resize();
    window.addEventListener("resize", Resize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", Resize);
  });

  return {
    sizes,
    OnResize,
  };
};
