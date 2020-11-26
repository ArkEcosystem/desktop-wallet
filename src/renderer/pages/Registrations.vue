<template>
  <section class="Registrations flex flex-col">
    <div class="bg-theme-feature rounded-lg w-full px-10 py-6 flex items-center justify-between">
      <h2>My Registrations</h2>
      <ButtonModal
        label="New Registration"
        class="m-0 ButtonGeneric blue-button"
      >
        <template slot-scope="{ toggle, isOpen }">
          <TransactionModal
            v-if="isOpen"
            :type="6"
            :group="2"
            :entity-action="0"
            title=""
            @cancel="toggle"
            @sent="toggle"
          />
        </template>
      </ButtonModal>
    </div>
  </section>
</template>

<script>
import { ButtonModal } from '@/components/Button'
import { TransactionModal } from '@/components/Transaction'

export default {
  name: 'Registrations',

  components: {
    ButtonModal,
    TransactionModal
  }
}
</script>
