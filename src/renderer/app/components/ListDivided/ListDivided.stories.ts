import ListDivided from "./ListDivided.vue";
import ListDividedItem from "./ListDividedItem.vue";
import Toggle from "@/app/components/Toggle/Toggle.vue";

export default { title: "Basic / ListDivided" };

export const Default = () => ({
  components: { ListDivided, ListDividedItem },
  template: `
    <div class="max-w-lg p-5 space-y-5">
      <ListDivided>
        <ListDividedItem label="Recipient">
          XYZ
        </ListDividedItem>
        <ListDividedItem label="Amount">
          + Ѧ 0.0000001
        </ListDividedItem>
        <ListDividedItem label="Transaction fee">
          Ѧ 0.03145383
        </ListDividedItem>
      </ListDivided>
    </div>
  `,
});

export const FloatingLabel = () => ({
  components: { ListDivided, ListDividedItem },
  template: `
    <div class="max-w-lg p-5 space-y-5">
      <ListDivided :is-floating-label="true">
        <ListDividedItem label="Recipient">
          XYZ
        </ListDividedItem>
        <ListDividedItem label="Amount">
          + Ѧ 0.0000001
        </ListDividedItem>
        <ListDividedItem label="Transaction fee">
          Ѧ 0.03145383
        </ListDividedItem>
      </ListDivided>
    </div>
  `,
});

export const LabelDescription = () => ({
  components: { ListDivided, ListDividedItem, Toggle },
  template: `
    <div class="max-w-lg p-5 space-y-5">
      <ListDivided>
        <ListDividedItem label="Dark Theme" label-description="Want to set the wallet to dark mode?">
          <Toggle />
        </ListDividedItem>
        <ListDividedItem label="Price Chart" label-description="Price chart on the dashboard">
          <Toggle />
        </ListDividedItem>
    </div>
  `,
});
