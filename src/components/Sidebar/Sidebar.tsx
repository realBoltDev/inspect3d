import { Combobox, Input, InputBase, useCombobox, Text, Skeleton } from '@mantine/core';
import { useState } from 'react';

const groceries = [
  'AK-47',
  'M4A4',
  'AWP'
];

export function Sidebar() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string | null>('M4A4');

  const options = groceries.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <>
      <Text fz={24}>
        Weapon Type:
      </Text>

      <Combobox
        size='md'
        store={combobox}
        withinPortal={false}
        transitionProps={{ duration: 200, transition: 'pop' }}
        onOptionSubmit={(val) => {
          setValue(val);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            size='md'
            component="button"
            type="button"
            pointer
            rightSection={<Combobox.Chevron />}
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents="none"
          >
            {value || <Input.Placeholder>Pick value</Input.Placeholder>}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}