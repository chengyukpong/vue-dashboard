<script setup lang="ts">
interface SelectableTable {
  getIsSomePageRowsSelected(): boolean
  getIsAllPageRowsSelected(): boolean
  toggleAllPageRowsSelected(value: boolean): void
}

const props = defineProps<{ table: SelectableTable }>()

const modelValue = computed(() => {
  return props.table.getIsSomePageRowsSelected()
    ? 'indeterminate'
    : props.table.getIsAllPageRowsSelected()
})

function onUpdate(value: boolean | 'indeterminate') {
  props.table.toggleAllPageRowsSelected(!!value)
}
</script>

<template>
  <UCheckbox
    :model-value="modelValue"
    aria-label="Select all"
    @update:model-value="onUpdate"
  />
</template>
