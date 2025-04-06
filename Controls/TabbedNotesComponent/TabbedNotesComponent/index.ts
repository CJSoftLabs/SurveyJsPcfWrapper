import * as React from "react";
import { createRoot, Root } from 'react-dom/client';
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { TabbedNotesControl, TabbedNotesProps } from "./TabbedNotesControl";
import { initializeIcons } from '@fluentui/react/lib/Icons';

export class TabbedNotesComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private notifyOutputChanged: () => void;
  private container: HTMLDivElement;
  private rootControl: Root;
  private ComponentUiJson;
  private ComponentJson;
  private ReadOnly: boolean;
  private oTabbedNotesProps: TabbedNotesProps;

  onValueChanged = (updatedData: { [tabName: string]: string }) => {
      Object.entries(updatedData).forEach(([key, value]) => {
        this.ComponentJson[key] = value;
      });
      this.notifyOutputChanged();
      return {}; 
  };

  /**
   * Empty constructor.
   */
  constructor()
  {
      this.oTabbedNotesProps = {
          data: {},
          UiConfig: [],
          onEdit: this.onValueChanged,
          isReadOnly: false
      }
  }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
  {
      // Add control initialization code
      this.container = container;
      this.notifyOutputChanged = notifyOutputChanged;
      this.ComponentUiJson = JSON.parse(context.parameters.ComponentUiJson.raw || '[{"name": "default"}]');
      this.ComponentJson = JSON.parse(context.parameters.ComponentJson.raw || '{}');
      this.ReadOnly = this.ToBoolean(context.parameters.ReadOnly.raw || "");

      initializeIcons();
  }


  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void
  {
      // Add code to update control view
      this.RenderControl();
  }

  private ToBoolean(strInput: string): boolean {
      let bReturn = false;
      switch(strInput.toLowerCase().trim()) {
          case "1":
          case "true":
          case "yes":
              bReturn = true;
              break;
      }

      return bReturn;
  }

  private RenderControl(){
      if(this.rootControl === undefined)
      {
          this.rootControl = createRoot(this.container);
      }
      this.oTabbedNotesProps.data = this.ComponentJson;
      this.oTabbedNotesProps.UiConfig = this.ComponentUiJson;
      this.oTabbedNotesProps.isReadOnly = this.ReadOnly;
      this.rootControl.render(React.createElement(
          TabbedNotesControl,
          this.oTabbedNotesProps
      ));
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs
  {
      return { ComponentJson: JSON.stringify( this.ComponentJson) } as IOutputs;
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void
  {
      // Add code to cleanup control if necessary
  }
}