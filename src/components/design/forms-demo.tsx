"use client";

import * as React from "react";
import { FormField } from "@/components/patterns/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

function ToggleRow({
  label,
  control,
}: {
  label: string;
  control: (id: string) => React.ReactNode;
}) {
  const id = React.useId();
  return (
    <div className="flex items-center gap-3">
      {control(id)}
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

// Form controls with their label, helper text and error state. Single column, label above, errors inline.
export function FormsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <FormField
        label="Project name"
        helper="Shown in lists and on the project page."
        required
      >
        {(props) => <Input {...props} placeholder="Rao villa, Whitefield" />}
      </FormField>

      <FormField
        label="Client email"
        error="Enter an email address, like name@example.com."
      >
        {(props) => <Input {...props} defaultValue="rao.example" />}
      </FormField>

      <FormField label="Project type">
        {(props) => (
          <Select>
            <SelectTrigger {...props}>
              <SelectValue placeholder="Choose a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
            </SelectContent>
          </Select>
        )}
      </FormField>

      <FormField label="Site notes" helper="Access, lift size, working hours.">
        {(props) => <Textarea {...props} />}
      </FormField>

      <FormField
        label="Disabled field"
        helper="Say why a field is disabled; never leave it unexplained."
      >
        {(props) => <Input {...props} disabled defaultValue="Set by Admin" />}
      </FormField>

      <ToggleRow
        label="Tell the team lead when this is late"
        control={(id) => <Checkbox id={id} defaultChecked />}
      />
      <ToggleRow
        label="Send me a daily email digest"
        control={(id) => <Switch id={id} />}
      />
    </div>
  );
}
