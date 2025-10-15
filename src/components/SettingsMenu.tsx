// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import { CSSProperties, useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';
import { ModelContext } from './contexts.ts';
import { isInStandaloneMode } from '../utils.ts';
import { confirmDialog } from 'primereact/confirmdialog';

export default function SettingsMenu({className, style}: {className?: string, style?: CSSProperties}) {
  const model = useContext(ModelContext);
  if (!model) throw new Error('No model');
  const state = model.state;

  const settingsMenu = useRef<Menu>(null);
  return (
    <>
      <Menu
        key={`settings-menu-${state.view.theme}`}
        model={[
          {
            label: state.view.layout.mode === 'multi'
              ? 'Switch to single panel mode'
              : "Switch to side-by-side mode",
            icon: 'pi pi-table',
            // disabled: true,
            command: () => model.changeLayout(state.view.layout.mode === 'multi' ? 'single' : 'multi'),
          },
          {
            separator: true
          },
          {
            label: state.view.showAxes ? 'Hide axes' : 'Show axes',
            icon: 'pi pi-asterisk',
            // disabled: true,
            command: () => model.mutate(s => s.view.showAxes = !s.view.showAxes)
          },
          {
            label: state.view.lineNumbers ? 'Hide line numbers' : 'Show line numbers',
            icon: 'pi pi-list',
            // disabled: true,
            command: () => model.mutate(s => s.view.lineNumbers = !s.view.lineNumbers)
          },
          ...(isInStandaloneMode() ? [
            {
              separator: true
            },
            {
              label: 'Clear local storage',
              icon: 'pi pi-list',
              // disabled: true,
              command: () => {
                confirmDialog({
                  message: "This will clear all the edits you've made and files you've created in this playground " +
                    "and will reset it to factory defaults. " +
                    "Are you sure you wish to proceed? (you might lose your models!)",
                  header: 'Clear local storage',
                  icon: 'pi pi-exclamation-triangle',
                  accept: () => {
                    localStorage.clear();
                    location.reload();
                  },
                  acceptLabel: `Clear all files!`,
                  rejectLabel: 'Cancel'
                });
              },
            },
          ] : []),
        ] as MenuItem[]}
        popup
        ref={settingsMenu}
      />
    
      <Button title="Settings menu"
          style={style}
          className={className}
          rounded
          text
          icon="pi pi-cog"
          onClick={(e) => settingsMenu.current && settingsMenu.current.toggle(e)} />
    </>
  );
}