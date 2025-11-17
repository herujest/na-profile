declare module "react-datepicker" {
  import { Component } from "react";

  interface ReactDatePickerProps {
    selected?: Date | null;
    onChange?: (date: Date | null) => void;
    className?: string;
    [key: string]: any;
  }

  export default class DatePicker extends Component<ReactDatePickerProps> {}
}

