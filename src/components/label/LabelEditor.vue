<template>
  <v-card class="label-editor-card rounded-0">
    <!-- 1. 标题区域 -->
    <v-card-title class="text-subtitle-1 d-flex align-center justify-space-between">
      Label Editor
      <v-btn
          icon="mdi-plus"
          size="small"
          variant="text"
          @click="showAddDialog = true" /><!--点击按钮后，弹出一个添加项的对话框 -->
      />
    </v-card-title>
    <!-- 2. 标签列表内容区域 -->
    <v-card-text class="label-editor-content">
      <v-list density="compact">
        <v-list-item
            v-for="label in labels"
            :key="label.id"
            :value="label.id"
            class="px-2"
        > <!-- 选择框 -->
          <template v-slot:prepend>  <!-- isSelected检查标签是否已被选中。toggleLabel切换标签的选择状态。-->
            <v-checkbox-btn
                :model-value="isSelected(label.id)"
                color="primary"
                density="compact"
                @update:model-value="() => toggleLabel(label.id)"
            />
          </template>
          <!-- 标签名称 -->
          <v-list-item-title>{{ label.name }}</v-list-item-title>
          <!-- 删除按钮 -->
          <template v-slot:append>
            <v-btn
                class="delete-btn"
                icon="mdi-delete"
                size="small"
                variant="text"
                @click="removeLabel(label.id)"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <!-- 3. 新建标签对话框 -->
    <v-dialog v-model="showAddDialog" max-width="300px">
      <v-card>
        <v-card-title>Add New Label</v-card-title>
        <v-card-text>
          <v-text-field
              v-model="newLabelName"
              label="Label Name"
              @keyup.enter="handleAddLabel"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              :disabled="!newLabelName.trim()"
              color="primary"
              variant="text"
              @click="handleAddLabel"
          >
            Add
          </v-btn>
          <v-btn
              color="grey"
              variant="text"
              @click="closeDialog"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useLabelStore} from '@/stores'
import {storeToRefs} from 'pinia'

const labelStore = useLabelStore()
const {labels, selectedLabels} = storeToRefs(labelStore)

const showAddDialog = ref(false)
const newLabelName = ref('')

const isSelected = (labelId: string) => {
  return selectedLabels.value.some(label => label.id === labelId)
}

const handleAddLabel = () => {
  if (newLabelName.value.trim()) {
    labelStore.addLabel(newLabelName.value)
    closeDialog()
  }
}

const closeDialog = () => {
  showAddDialog.value = false
  newLabelName.value = ''
}

const {toggleLabel, removeLabel} = labelStore
</script>

<style scoped>
.label-editor-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 0;
}

.label-editor-content {
  flex: 1;
  overflow-y: auto;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.v-list-item:hover .delete-btn {
  opacity: 1;
}

:deep(.v-list-item__content) {
  overflow: hidden;
}

:deep(.v-list-item__title) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>