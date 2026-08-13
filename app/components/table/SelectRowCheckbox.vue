<script setup lang="ts">
interface SelectableRow {
  getIsSelected(): boolean
  toggleSelected(value: boolean): void
}

const { row } = defineProps<{ row: SelectableRow }>()

const modelValue = computed(() => row.getIsSelected())

function onUpdate(value: boolean | 'indeterminate') {
  row.toggleSelected(value === true)
}
</script>

<template>
  <UCheckbox
    :model-value="modelValue"
    aria-label="Select row"
    @update:model-value="onUpdate"
  />
</template>
