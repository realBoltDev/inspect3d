import { Stack, Button, Combobox, Input, InputBase, useCombobox, Text, Slider } from '@mantine/core';
import { useWeaponStore } from '@/store/weaponStore';
import { useEffect } from 'react';

const weaponsData: Record<string, string[]> = {
  "AK-47": ["Asiimov", "Neon Revolution", "Phantom Disruptor"],
  "M4A4": ["The Emperor", "Desolate Space", "Temukau"],
  "M4A1-S": ["Cyrex", "Player Two", "Decimator"],
  "AWP": ["Dragon Lore", "Neo-Noir", "Wildfire"],
  "Desert Eagle": ["Ocean Drive", "Printstream", "Trigger Discipline"]
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
    rotation, toggleRotation,
    rotation_speed, setRotationSpeed
  } = useWeaponStore();

  useEffect(() => {
    if (!weapon) setWeapon("AK-47");
    if (!skin) setSkin("Asiimov");
    if (rotation_speed === null) setRotationSpeed(0.01);
  }, []); // Empty dependency array - only runs on mount

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
            setSkin(null); // Clear skin when weapon changes
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

      <div>
        <Text fz={24}>Rotation Speed:</Text>
        <Slider min={0} max={0.1} step={0.0001} defaultValue={0.01} label={null} onChange={setRotationSpeed} />
      </div>
    </Stack>
  );
}