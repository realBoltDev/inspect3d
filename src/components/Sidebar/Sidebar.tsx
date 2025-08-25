import { Stack, Button, Combobox, Input, InputBase, useCombobox, Text } from '@mantine/core';
import { useWeaponStore } from '@/store/weaponStore';
import { useState } from 'react';

const weaponsData: Record<string, string[]> = {
  "AK-47": ["Asiimov", "Neon Revolution"],
  "M4A4": ["Howl", "Neo-Noir"],
  "AWP": ["Dragon Lore", "Neo-Noir"],
  "Desert Eagle": ["Blaze", "Kumicho Dragon", "Golden Koi"],
  "Butterfly Knife": ["Fade", "Crimson Web", "Doppler"],
};

export function Sidebar() {
  const weaponCombobox = useCombobox({
    onDropdownClose: () => weaponCombobox.resetSelectedOption(),
  });
  const skinCombobox = useCombobox({
    onDropdownClose: () => skinCombobox.resetSelectedOption(),
  });

  const {
    weapon, setWeapon,
    skin, setSkin,
    wireframe, toggleWireframe,
    rotation, toggleRotation
  } = useWeaponStore();

  const weaponOptions = Object.keys(weaponsData).map((w) => (
    <Combobox.Option key={w} value={w}>
      {w}
    </Combobox.Option>
  ));

  const skinOptions = weapon && weaponsData[weapon]
    ? weaponsData[weapon].map((s) => (
      <Combobox.Option key={s} value={s}>
        {s}
      </Combobox.Option>
    ))
    : [];

  return (
    <Stack gap="lg">
      <div>
        <Text fz={24}>Weapon:</Text>
        <Combobox size="md" store={weaponCombobox} withinPortal={false} transitionProps={{ duration: 200, transition: 'pop' }}
          onOptionSubmit={(val) => {
            setWeapon(val);
            setSkin(null);
            weaponCombobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <InputBase size="md" component="button" type="button" pointer rightSection={<Combobox.Chevron />}
              onClick={() => weaponCombobox.toggleDropdown()}
              rightSectionPointerEvents="none"
            >
              {weapon || <Input.Placeholder>Pick weapon</Input.Placeholder>}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>{weaponOptions}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </div>

      <div>
        <Text fz={24}>Skin:</Text>
        <Combobox size="md" store={skinCombobox} withinPortal={false} transitionProps={{ duration: 200, transition: 'pop' }}
          disabled={!weapon} // disable until a weapon is chosen
          onOptionSubmit={(val) => {
            setSkin(val);
            skinCombobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <InputBase size="md" component="button" type="button" pointer rightSection={<Combobox.Chevron />}
              onClick={() => { if (weapon) skinCombobox.toggleDropdown() }}
              rightSectionPointerEvents="none"
            >
              {skin || <Input.Placeholder>
                {weapon ? "Pick skin" : "Select a weapon first"}
              </Input.Placeholder>}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>{skinOptions}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </div>

      <div>
        <Text fz={24}>Wireframe: {wireframe ? "ON" : "OFF"}</Text>
        <Button variant="default" color="gray" style={{ width: "fit-content" }}
          onClick={() => toggleWireframe()}
        >Toggle</Button>
      </div>

      <div>
        <Text fz={24}>Rotation: {rotation ? "ON" : "OFF"}</Text>
        <Button variant="default" color="gray" style={{ width: "fit-content" }}
          onClick={() => toggleRotation()}
        >Toggle</Button>
      </div>
    </Stack>
  );
}