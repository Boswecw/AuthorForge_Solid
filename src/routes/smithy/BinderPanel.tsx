// src/routes/smithy/BinderPanel.tsx
import type { Component } from "solid-js";
import { Binder } from "~/components/Binder";

interface BinderPanelProps {
  onSelectDoc: (id: string) => void;
}

const BinderPanel: Component<BinderPanelProps> = (props) => {
  return (
    <Binder
      onSelect={(id: string) => {
        props.onSelectDoc(id);
      }}
    />
  );
};

export default BinderPanel;
