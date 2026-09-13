<template>
  <div class="pb-28">
    <h1 class="font-display text-4xl text-bronze">Items</h1>
    <p class="mt-1 text-sm text-bronze/60">Use the arrows to set the order inside each category.</p>
    <button
      type="button"
      class="mt-4 w-full rounded-full bg-bronze px-4 py-3 text-sm text-cream sm:w-auto sm:py-2"
      @click="startCreate"
    >
      Add item
    </button>
    <select
      v-model="filter"
      class="mt-3 w-full max-w-full rounded-full border border-stone bg-white px-4 py-3 text-sm sm:mt-4 sm:max-w-xs sm:py-2"
    >
      <option value="">All categories</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name_en }}
      </option>
    </select>

    <AdminModal :open="editing" :title="form.id ? 'Edit item' : 'New item'" @close="editing = false">
      <form id="item-form" class="grid gap-3" @submit.prevent="save">
        <label
          class="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm"
          :class="form.is_new ? 'border-bronze bg-bronze text-cream' : 'border-stone bg-cream text-bronze'"
        >
          <span class="font-medium">{{ form.is_new ? 'Marked as new' : 'Mark as new' }}</span>
          <input v-model="form.is_new" type="checkbox" class="h-5 w-5 accent-bronze" />
        </label>
        <label class="text-sm">
          Category
          <select v-model="form.category_id" required class="mt-1 w-full rounded-lg border border-stone px-3 py-2.5">
            <option disabled value="">Choose…</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name_en }} / {{ category.name_ar }}
            </option>
          </select>
        </label>
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
        <label class="text-sm">
          Description (AR)
          <textarea v-model="form.description_ar" rows="2" class="mt-1 w-full rounded-lg border border-stone px-3 py-2.5" />
        </label>
        <label class="text-sm">
          Description (EN)
          <textarea v-model="form.description_en" rows="2" class="mt-1 w-full rounded-lg border border-stone px-3 py-2.5" />
        </label>
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm">
            Price
            <input v-model="form.price" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border border-stone px-3 py-2.5" />
          </label>
          <label class="text-sm">
            Large price (pizza)
            <input v-model="form.price_large" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border border-stone px-3 py-2.5" />
          </label>
        </div>
        <label class="flex min-h-11 items-center gap-2 text-sm">
          <input v-model="form.is_available" type="checkbox" class="h-4 w-4" />
          Available
        </label>
        <label class="text-sm">
          Image URL
          <input v-model="form.image_path" type="url" placeholder="https://..." class="mt-1 w-full rounded-lg border border-stone px-3 py-2.5" />
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

    <p v-if="loading" class="mt-6 text-sm text-bronze/60">Loading items…</p>
    <p v-else-if="loadError" class="mt-6 text-sm text-red-700">{{ loadError }}</p>
    <div v-else class="mt-5 space-y-8">
      <section v-for="group in itemGroups" :key="group.category.id">
        <h2 v-if="!filter" class="mb-3 font-display text-2xl text-bronze">
          {{ group.category.name_en }}
        </h2>
        <p v-if="group.items.length === 0" class="text-sm text-bronze/50">No items in this category.</p>
        <ul v-else class="space-y-3">
          <li
            v-for="(item, index) in group.items"
            :key="item.id"
            class="rounded-2xl border border-stone bg-white p-4 [content-visibility:auto] [contain-intrinsic-size:0_9rem]"
          >
            <div class="flex gap-3">
              <AdminReorderButtons
                :index="index"
                :total="group.items.length"
                :busy="savingOrder"
                @move="moveItem(group.category.id, index, $event)"
              />
              <img
                v-if="item.image_url"
                :src="item.image_url"
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
                <p class="break-words font-medium text-ink">
                  {{ item.name_ar }}
                  <span
                    v-if="item.is_new"
                    class="ms-2 inline-block rounded-full bg-bronze px-2 py-0.5 align-middle text-[10px] font-semibold tracking-wide text-cream uppercase"
                  >
                    New
                  </span>
                </p>
                <p class="break-words text-sm text-bronze/70">{{ item.name_en }}</p>
                <p class="mt-1 break-words text-xs text-bronze/50">
                  {{ item.category?.name_en }} · {{ priceLabel(item) }} ·
                  {{ item.is_available ? 'Available' : 'Unavailable' }}
                </p>
              </div>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-2">
              <button
                class="rounded-full border py-2.5 text-sm"
                :class="item.is_new ? 'border-bronze bg-bronze text-cream' : 'border-stone text-bronze'"
                type="button"
                @click="toggleNew(item)"
              >
                {{ item.is_new ? 'New' : 'Mark new' }}
              </button>
              <button
                class="rounded-full border border-stone py-2.5 text-sm text-bronze"
                type="button"
                @click="startEdit(item)"
              >
                Edit
              </button>
              <button class="rounded-full border border-red-200 py-2.5 text-sm text-red-700" type="button" @click="remove(item)">
                Delete
              </button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import http, { csrf } from '../../api/http'
import AdminModal from '../../components/AdminModal.vue'
import AdminReorderButtons from '../../components/AdminReorderButtons.vue'

const categories = ref([])
const items = ref([])
const filter = ref('')
const editing = ref(false)
const error = ref('')
const loading = ref(true)
const loadError = ref('')
const imageFile = ref(null)
const savingOrder = ref(false)
const form = reactive(emptyForm())
const dirtyCategories = new Set()

const itemGroups = computed(() => {
  const cats = filter.value
    ? categories.value.filter((category) => String(category.id) === String(filter.value))
    : categories.value

  return cats.map((category) => ({
    category,
    items: items.value.filter((item) => String(item.category_id) === String(category.id)),
  }))
})

function emptyForm() {
  return {
    id: null,
    category_id: '',
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: '',
    price_large: '',
    is_available: true,
    is_new: false,
    image_path: '',
  }
}

function priceLabel(item) {
  if (item.price_large) {
    return `${item.price ?? '—'} / ${item.price_large}`
  }
  return item.price ?? '—'
}

async function load() {
  loading.value = items.value.length === 0
  loadError.value = ''
  try {
    const [catRes, itemRes] = await Promise.all([http.get('/categories'), http.get('/items')])
    categories.value = catRes.data.data ?? catRes.data
    items.value = itemRes.data.data ?? itemRes.data
  } catch {
    loadError.value = 'Could not load items.'
  } finally {
    loading.value = false
  }
}

function startCreate() {
  Object.assign(form, emptyForm(), {
    category_id: filter.value || categories.value[0]?.id || '',
  })
  imageFile.value = null
  editing.value = true
  error.value = ''
}

function startEdit(item) {
  Object.assign(form, {
    id: item.id,
    category_id: item.category_id,
    name_ar: item.name_ar,
    name_en: item.name_en,
    description_ar: item.description_ar || '',
    description_en: item.description_en || '',
    price: item.price ?? '',
    price_large: item.price_large ?? '',
    is_available: item.is_available,
    is_new: Boolean(item.is_new),
    image_path: item.image_path || item.image_url || '',
  })
  imageFile.value = null
  editing.value = true
  error.value = ''
}

function onFile(event) {
  imageFile.value = event.target.files?.[0] ?? null
}

function itemsInCategory(categoryId) {
  return items.value.filter((item) => String(item.category_id) === String(categoryId))
}

function moveItem(categoryId, index, delta) {
  const group = itemsInCategory(categoryId)
  const next = index + delta
  if (next < 0 || next >= group.length) {
    return
  }

  const reordered = [...group]
  const [row] = reordered.splice(index, 1)
  reordered.splice(next, 0, row)

  let cursor = 0
  items.value = items.value.map((item) => {
    if (String(item.category_id) !== String(categoryId)) {
      return item
    }
    return reordered[cursor++]
  })

  persistOrder(categoryId)
}

async function persistOrder(categoryId) {
  dirtyCategories.add(String(categoryId))
  if (savingOrder.value) {
    return
  }
  savingOrder.value = true
  try {
    while (dirtyCategories.size) {
      const id = dirtyCategories.values().next().value
      dirtyCategories.delete(id)
      const ids = itemsInCategory(id).map((item) => item.id)
      await csrf()
      await http.post('/items/reorder', { ids })
    }
  } catch {
    dirtyCategories.clear()
    await load()
  } finally {
    savingOrder.value = false
    if (dirtyCategories.size) {
      persistOrder(dirtyCategories.values().next().value)
    }
  }
}

function payload() {
  return {
    category_id: form.category_id,
    name_ar: form.name_ar,
    name_en: form.name_en,
    description_ar: form.description_ar || null,
    description_en: form.description_en || null,
    price: form.price === '' ? null : form.price,
    price_large: form.price_large === '' ? null : form.price_large,
    is_available: form.is_available,
    is_new: form.is_new,
    image_path: form.image_path || null,
  }
}

async function toggleNew(item) {
  try {
    await csrf()
    await http.put(`/items/${item.id}`, { is_new: !item.is_new })
    item.is_new = !item.is_new
  } catch {
    error.value = 'Could not update item.'
  }
}

async function save() {
  error.value = ''
  try {
    await csrf()
    let id = form.id
    if (id) {
      await http.put(`/items/${id}`, payload())
    } else {
      const { data } = await http.post('/items', payload())
      id = (data.data ?? data).id
    }
    if (imageFile.value && id) {
      const body = new FormData()
      body.append('image', imageFile.value)
      await http.post(`/items/${id}/image`, body)
    }
    editing.value = false
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not save item.'
  }
}

async function remove(item) {
  if (!confirm(`Delete “${item.name_en}”?`)) {
    return
  }
  await csrf()
  await http.delete(`/items/${item.id}`)
  await load()
}

onMounted(load)
</script>
