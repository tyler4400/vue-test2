<template>
  <div>
    <h3>二次封装-最终版</h3>
    <p>自己定义的属性： {{ aaa }}</p>
    <component :is="h(FancyInput, { ...$attrs, ...props, ref: changeRef }, $slots)" />
  </div>
</template>

<script setup lang="ts">
import { h, getCurrentInstance, type ComponentInstance } from 'vue'
import { FancyInput, type InputInstance, type InputProps } from '../../components/input'

// 获取当前实例。这个api是内部api，官方文档查不到。
const vm = getCurrentInstance()

/**
 * ref 可以接收一个函数值，用于对存储引用位置的完全控制
 * @param value
 */
const changeRef = (value: unknown /* 或更宽 */) => {
  // 如果是 null（卸载场景），清空 vm.exposed
  if (value == null) {
    vm!.exposed = null
    return
  }

  // 如果看起来像我们的 InputInstance（有 ref 属性）
  if ('ref' in (value as any)) {
    const exposed = value as InputInstance
    console.log('exposed', exposed.ref)
    vm!.exposed = exposed
    vm!.exposeProxy = exposed // 也要修改代理对象
  }

  // 其它情况忽略（不符合我们预期的 ref 值）
}

/**
 * 我们已经使用了vm.exposed,这里再使用defineExpose只是为了类型提示，对实际代码没有任何影响
 * ComponentInstance是内部ts工具类型，用来提取组件实例
 * 这行代码就可以获得所有的类型提示。包括expose，props
 *
 * 不幸的是， 这个方法只支持vscode ，因为它是基于vue-language-tools。 webstorm没有全部集成vue-language-tools 所以不支持😭
 */
defineExpose({} as ComponentInstance<typeof FancyInput>)

/**
 * 如果是webstorm不支持上面的写法。 就必须使用defineProps了， 在define的时候指定同样的类型。例如：
 * 还可以加入自己的类型
 */
const { aaa, ...props } = defineProps<InputProps & { aaa: string }>()
</script>
