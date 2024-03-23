import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { createRoot, Root } from 'react-dom/client';
import { SurveyJsFormCollectionPcfComponent, SurveyJsFormCollectionPcfProps } from "./SurveyJsFormCollectionPcfComponent";
import React from "react";

export class SurveyJsFormCollection implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;
    private container: HTMLDivElement;
    private rootControl: Root;
    private RecordId: any;
    private RecordType: any;
    private RecordName: any;
    private LookupId: any;
    private LookupName: any;
    private LookupType: any;
    private ReadOnly: boolean;
    private ThemeName: string;
    private QueryParameters: string;
    private QueryEntity: string;
    private FieldMapping: string;
    private oParam: SurveyJsFormCollectionPcfProps;
    private SurveyData: string;
    private SurveyModelData: string;
    private dropdownElement: HTMLSelectElement;
    private SurveyJsContainer: any;
    private OtherSurveys: any;

    onJsonValueChanged = (strJson: string, bCompleted: boolean): {} => {
        // this.SurveyData = strJson;
        // this.Completed = bCompleted;
        //console.log("onJsonValueChanged triggered");
        // this.notifyOutputChanged();

        return {}; 
    };

    /**
     * Empty constructor.
     */
    constructor()
    {
        this.SurveyModelData = "{}";
        this.SurveyData = "{}";
        this.oParam = {
            SurveyModelData: JSON.parse(this.SurveyModelData),
            ThemeName: "Default",
            SurveyData: JSON.parse(this.SurveyData),
            ReadOnly: false,
            onValueChanged: this.onJsonValueChanged
        };
        this.OtherSurveys = {
            "entities": []
        };
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
        this.context = context;
        this.RecordId = (context.mode as any).contextInfo.entityId;
        this.RecordType = (context.mode as any).contextInfo.entityTypeName;
        this.RecordName = (context.mode as any).contextInfo.entityRecordName;
        this.notifyOutputChanged = notifyOutputChanged;
        console.log(context);

        // Add control initialization code
        const Lookup = context.parameters.Lookup.raw;
        this.LookupId = Lookup[0].id;
        this.LookupType = Lookup[0].entityType;
        this.LookupName = Lookup[0].name;
        this.ReadOnly = this.ToBoolean(context.parameters.ReadOnly.raw || "");
        this.ThemeName = context.parameters.ThemeName.raw || "Default";
        this.QueryParameters = (context.parameters.QueryParameters.raw || "").replace("{0}", this.LookupId);
        this.QueryEntity = context.parameters.QueryEntity.raw || "";
        this.FieldMapping = context.parameters.FieldMapping.raw || "";
        
        //Retrieve the related records.
        // this.LoadRelatedRecords();

        // Parse JSON and render controls
        //this.renderControls();
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        //this.Lookup = context.parameters.Lookup.raw;
        this.ReadOnly = this.ToBoolean(context.parameters.ReadOnly.raw || "");
        this.ThemeName = context.parameters.ThemeName.raw || "Default";
        //this.QueryParameters = (context.parameters.QueryParameters.raw || "").replace("{0}", this.Lookup[0].id);
        this.QueryEntity = context.parameters.QueryEntity.raw || "";
        this.FieldMapping = context.parameters.FieldMapping.raw || "";
        console.log("UpdateView triggered");
        
        //Retrieve the related records.
        this.LoadRelatedRecords();

        // Parse JSON and render controls
        // this.renderControls();
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

    private renderControls(): void {
        console.log("Render Control triggered.");

        if(this.dropdownElement === undefined) {
            const DropdownContainer = document.createElement('div');
            DropdownContainer.className = "column-container";
            const config = JSON.parse(this.FieldMapping);
            const displayPattern = config.DisplayPattern;

            const LabelContainer = document.createElement('div');
            const label = document.createElement("label");
            label.innerText = config.LabelText;
            LabelContainer.appendChild(label);
            LabelContainer.style.width = "30%";

            const SelectContainer = document.createElement('div');
            this.dropdownElement = document.createElement("select");
            this.dropdownElement.style.width = "100%";
            this.dropdownElement.addEventListener("change", (event) => {
                const selectedValue = (event.target as HTMLSelectElement).value;
                if(selectedValue === "") {
                    this.SurveyModelData = "";
                    this.SurveyData = "";
                    this.SurveyJsContainer.style.display = "none";
                }
                else {
                    // Find the corresponding entity object from data.entities based on the selected value
                    const selectedEntity = this.OtherSurveys.entities.find((entity: any) => entity[config.ValueProperty] === selectedValue);
                    this.SurveyModelData = selectedEntity[config.SurveyModel];
                    this.SurveyData = selectedEntity[config.SurveyResponse];
                    this.SurveyJsContainer.style.display = "block";
                }
                // console.log("SurveyModelData: " + this.SurveyModelData);
                // console.log("SurveyData: " + this.SurveyData);
                this.RenderSurveyControl();
            });
            SelectContainer.appendChild(this.dropdownElement);
            
            // Create a default option element
            const option = document.createElement('option');
            // Set the text and value of the option element
            option.text = config.DefaultText;
            option.value = "";
            // Append the option element to the dropdown
            this.dropdownElement.appendChild(option);

            this.OtherSurveys.entities.forEach((entity: any) => {
                if (entity[config.ValuePropert] !== this.RecordId) {
                    let dynamicText = displayPattern;
                    for (const key in config) {
                        if (Object.prototype.hasOwnProperty.call(config, key)) {
                            dynamicText = dynamicText.replace(`{${key}}`, entity[config[key]]);
                        }
                    }

                    dynamicText = dynamicText.replace("LookupId", this.LookupId);
                    dynamicText = dynamicText.replace("LookupName", this.LookupName);
                    dynamicText = dynamicText.replace("LookupType", this.LookupType);

                    // Create an option element for each entity
                    const option = document.createElement('option');
                    // Set the text and value of the option element
                    option.text = dynamicText;
                    option.value = entity[config.ValueProperty];
                    // Append the option element to the dropdown
                    this.dropdownElement.appendChild(option);
                }
            });

            DropdownContainer.appendChild(LabelContainer);
            DropdownContainer.appendChild(SelectContainer);
            this.container.appendChild(DropdownContainer);
            this.RenderSurveyControl();
        }
    }

    LoadRelatedRecords() {
        this.context.webAPI.retrieveMultipleRecords(this.QueryEntity, this.QueryParameters).then((response: any) => {
            this.OtherSurveys = response;
            this.renderControls();
        })
        .catch((error: any) => {
            this.OtherSurveys = { "entities": [] };
            console.error("Error fetching related records:", error);
        });
    }

    RenderSurveyControl() {
        try {
            this.oParam.SurveyModelData = JSON.parse(this.SurveyModelData);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            this.oParam.SurveyModelData = "{}";
        }
        try {
            this.oParam.SurveyData = JSON.parse(this.SurveyData);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            this.oParam.SurveyData = "{}";
        }
        this.oParam.ReadOnly = this.ReadOnly;
        this.oParam.ThemeName = this.ThemeName;

        if(this.SurveyJsContainer === undefined) {            
            this.SurveyJsContainer = document.createElement('div');
            this.SurveyJsContainer.style.display = "none";
            this.container.appendChild(this.SurveyJsContainer);
        }
        try{
            this.rootControl = createRoot(this.SurveyJsContainer);
            this.rootControl.render(
                React.createElement(SurveyJsFormCollectionPcfComponent, this.oParam)
            );
        } catch (error) {
            console.error("Error Loading the SurveyJS component: ", error);
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {};
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
