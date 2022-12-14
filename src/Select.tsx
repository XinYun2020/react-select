import { useState, useEffect, useRef } from "react";
import styles from "./select.module.css";

export type SelectOption = {
  label: string;
  value: string | number;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

/* 
    all props will have options 
    based on multiple => (SingleSelectProps | MultipleSelectProps)'s properties
*/
type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

/* Single Select Element */
export function Select({ multiple, value, onChange, options }: SelectProps) {
  /* Only show when we have state variable */
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null); // for keyboard accessibility

  const clearOptions = () => {
    /* Checking based on multiple property */
    multiple ? onChange([]) : onChange(undefined); // taking into account both values
  };

  const selectOption = (option: SelectOption) => {
    /* if the multiple element was selected, should call onChange */
    if (multiple) {
      /* same option selected => remove it */
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        /* new option => add in */
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  };

  const isOptionSelected = (option: SelectOption) => {
    return multiple ? value.includes(option) : option === value; // pass-in option is the same as value in the select box
  };

  /* if isOpen changes, reset HightlightedIndex to 0, the first one */
  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  /* Ref for keyboard accessibility */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      /*
        if the element that we are targeting with the 'keydown' event
        is not the actual container itself => return

        outside options, dont listenEvent
      */
      if (e.target != containerRef.current) return;
      /* Gives the key user is clicking */
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1); // the {} makes sure this variable always inside the block scope
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };

    containerRef.current?.addEventListener("keydown", handler);

    /* return a function that is going to remove the event listener */
    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [
    isOpen,
    highlightedIndex,
    options,
  ]); /* []: effect doesnt depend on any values from props or state, never re-run */

  return (
    <div
      ref={containerRef} // add keyboard accessibility
      onBlur={() => setIsOpen(false)} // click on other place will also close the dropdown
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={styles.container}
    >
      {/*tabIndex={0}: First thing tab to in webpage*/}
      <span className={styles.value}>
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className={styles["option-badge"]}
              >
                {v.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation(); // stop the click event to go all the way to parent div
          clearOptions();
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>

      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      {/* show or not show the options */}
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`${styles.option} 
            ${isOptionSelected(option) ? styles.selected : ""} 
            ${index === highlightedIndex ? styles.highlighted : ""}
            `}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
