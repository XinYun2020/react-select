import { useState } from "react";
import { Select, SelectOption } from "./Select"; // named export with {  }

const options = [
  { label: "Invoice ID", value: 1 },
  { label: "Customer ID", value: 1 },
  { label: "Created Date", value: "2022-09-21" },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
  { label: "Payment Amount", value: 1 },
];

function App() {
  /* State can be typeof options of undefined */
  const [value1, setValue1] = useState<SelectOption[]>([options[0]]); // typeof options[0] will give the label with the value
  const [value2, setValue2] = useState<SelectOption | undefined>(options[1]); // typeof options[0] will give the label with the value

  return (
    <>
      <Select
        multiple
        options={options}
        value={value1}
        onChange={(o) => setValue1(o)}
      />
      <br />
      <Select options={options} value={value2} onChange={(o) => setValue2(o)} />
    </>
  );
}

export default App;
