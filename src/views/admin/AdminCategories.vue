<template>
  <div class="pb-28">
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-4xl text-bronze">Categories</h1>
        <p class="mt-1 text-sm text-bronze/60">Use the arrows to set the public menu order.</p>
      </div>
      <button
        type="button"
        class="w-full rounded-full bg-bronze px-4 py-3 text-sm text-cream sm:w-auto sm:py-2"
        @click="startCreate"
      >
        Add category
      </button>
    </div>

    <AdminModal
      :open="editing"
      :title="form.id ? 'Edit category' : 'New category'"
      @close="editing = false"
    >
      <form id="category-form" class="grid gap-3" @submit.prevent="save">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm">
            Name (AR)
            <input v-model="form.name_ar" required class="mt-1 w-full rounded-lg border border-stone px-3 py-2.5" />
          </label>
          <label class="text-sm">
            Name (EN)
            <input v-model="form.name_en" required class="mt-1 w-full rounded-lg border border-stone px-3 py-2.5" />
          </label>
        </div>
        <label class="flex min-h-11 items-center gap-2 text-sm">
          <input v-model="form.is_active" type="checkbox" />
          Visible on public menu
        </label>
        <label class="text-sm">
          Image URL
          <input v-model="form.image" type="url" placeholder="https://..." class="mt-1 w-full rounded-lg border border-stone px-3 py-2.5" />
        </label>
        <label class="text-sm">
          Or upload a photo
          <input
            type="file"
            accept="image/*"
            class="mt-1 block w-full min-w-0 max-w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-cream file:px-4 file:py-2 file:text-sm file:text-bronze"
            @change="onFile"
          />
        </label>
          <p v-if="error" class="text-sm text-red-700">{{ error }}</p>
      </form>
      <template #footer>
        <div class="flex gap-2">
          <button
            type="button"
            class="flex-1 rounded-full border border-stone px-4 py-3 text-sm"
            @click="editing = false"
          >
            Cancel
          </button>
          <button type="button" class="flex-1 rounded-full bg-bronze px-4 py-3 text-sm text-cream" @click="save">
            Save
          </button>
        </div>
      </template>
    </AdminModal>

    <ul class="space-y-3">
      <li
        v-for="(category, index) in categories"
        :key="category.id"
        class="rounded-2xl border border-stone bg-white p-4"
      >
        <div class="flex gap-3">
          <AdminReorderButtons
            :index="index"
            :total="categories.length"
            :busy="savingOrder"
            @move="move(index, $event)"
          />
          <img
            v-if="category.image_url"
            :src="category.image_url"
            alt=""
            loading="lazy"
            decoding="async"
            class="h-16 w-16 shrink-0 rounded-xl object-cover"
          />
          <img
            v-else
            src="/branding/logo.png"
            alt=""
            class="h-16 w-16 shrink-0 object-contain"
          />
          <div class="min-w-0 flex-1">
            <p class="break-words font-medium text-ink">{{ category.name_ar }}</p>
            <p class="break-words text-sm text-bronze/70">{{ category.name_en }}</p>
            <p class="mt-1 text-xs text-bronze/50">
              {{ category.items_count ?? 0 }} items ·
              {{ category.is_active ? 'Visible' : 'Hidden' }}
            </p>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <button
            class="rounded-full border border-stone py-2.5 text-sm text-bronze"
            type="button"
            @click="startEdit(category)"
          >
            Edit
          </button>
          <button class="rounded-full border border-red-200 py-2.5 text-sm text-red-700" type="button" @click="remove(category)">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import http, { csrf } from '../../api/http'
import AdminModal from '../../components/AdminModal.vue'
import AdminReorderButtons from '../../components/AdminReorderButtons.vue'

const categories = ref([])
const editing = ref(false)
const error = ref('')
const imageFile = ref(null)
const savingOrder = ref(false)
const form = reactive(emptyForm())
let orderDirty = false

function emptyForm() {
  return {
    id: null,
    name_ar: '',
    name_en: '',
    is_active: true,
    image: '',
  }
}

async function load() {
  const { data } = await http.get('/categories')
  categories.value = data.data ?? data
}

function startCreate() {
  Object.assign(form, emptyForm())
  imageFile.value = null
  editing.value = true
  error.value = ''
}

function startEdit(category) {
  Object.assign(form, {
    id: category.id,
    name_ar: category.name_ar,
    name_en: category.name_en,
    is_active: category.is_active,
    image: category.image_url || category.image || '',
  })
  imageFile.value = null
  editing.value = true
  error.value = ''
}

function onFile(event) {
  imageFile.value = event.target.files?.[0] ?? null
}

function move(index, delta) {
  const next = index + delta
  if (next < 0 || next >= categories.value.length) {
    return
  }
  const copy = [...categories.value]
  const [row] = copy.splice(index, 1)
  copy.splice(next, 0, row)
  categories.value = copy
  persistOrder()
}

async function persistOrder() {
  orderDirty = true
  if (savingOrder.value) {
    return
  }
  savingOrder.value = true
  try {
    while (orderDirty) {
      orderDirty = false
      const ids = categories.value.map((category) => category.id)
      await csrf()
      await http.post('/categories/reorder', { ids })
    }
  } catch {
    await load()
  } finally {
    savingOrder.value = false
    if (orderDirty) {
      persistOrder()
    }
  }
}

async function save() {
  error.value = ''
  try {
    await csrf()
    const payload = {
      name_ar: form.name_ar,
      name_en: form.name_en,
      is_active: form.is_active,
      image: form.image || null,
    }
    let id = form.id
    if (id) {
      await http.put(`/categories/${id}`, payload)
    } else {
      const { data } = await http.post('/categories', payload)
      id = (data.data ?? data).id
    }
    if (imageFile.value && id) {
      const body = new FormData()
      body.append('image', imageFile.value)
      await http.post(`/categories/${id}/image`, body)
    }
    editing.value = false
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not save category.'
  }
}

async function remove(category) {
  if (!confirm(`Delete “${category.name_en}”? This also deletes its items.`)) {
    return
  }
  await csrf()
  await http.delete(`/categories/${category.id}`)
  await load()
}

onMounted(load)
</script>
