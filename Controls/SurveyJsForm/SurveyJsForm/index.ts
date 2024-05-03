/*
MIT License

Copyright (c) 2024 CJSoftLabs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {IInputs, IOutputs} from "./generated/ManifestTypes";
import React = require("react");
import { createRoot, Root } from 'react-dom/client';
import { SurveyJsFormPcfComponent, SurveyJsFormPcfProps } from "./SurveyJsFormPcfComponent";

export class SurveyJsForm implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private notifyOutputChanged: () => void;
    private container: HTMLDivElement;
    private context: ComponentFramework.Context<IInputs>;
    private SurveyModelData: string;
    private ReadOnly: boolean;
    private ReturnNoData: boolean;
    private ThemeName: string;
    private SurveyData: string;
    private rootControl: Root;
    private oParam: SurveyJsFormPcfProps;
    private Completed: boolean;
    private SaveAsPdf: boolean;
    private IsForm: boolean;
    private IsFormCollection: boolean;

    private RecordId: any;
    private LookupId: any;
    private LookupName: any;
    private LookupType: any;
    private QueryParameters: string;
    private QueryEntity: string;
    private FieldMapping: string;
    private dropdownElement: HTMLSelectElement;
    private SurveyJsContainer: any;
    private OtherSurveys: any;
    private ExternalFiles: any;


    onJsonValueChanged = (strJson: string, bCompleted: boolean): {} => {
        this.SurveyData = strJson;
        this.Completed = bCompleted;

        if(!this.ReturnNoData)
        {
            this.notifyOutputChanged();
        }

        return {}; 
    };

    /**
     * Empty constructor.
     */
    constructor()
    {
        this.IsForm = false;
        this.IsFormCollection = false;
        this.SurveyData = "{}";
        this.SurveyModelData = "{}";

        this.oParam = {
            SurveyModelData: JSON.parse("{}"),
            SurveyData: JSON.parse("{}"),
            //SurveyPdfModelData: JSON.parse("{}"),
            ThemeName: "Default",
            ReadOnly: false,
            EnableSaveAsPdf: false,
            onValueChanged: this.onJsonValueChanged
        };
        this.OtherSurveys = {
            "entities": []
        };
    }

    initializeExternalScripts() {
        if (typeof window.ClassicEditor === 'undefined') {
            var script_CkEditor = document.getElementById('script_CkEditor');
            if (!script_CkEditor) {
                // CKEditor script is not loaded, load it dynamically
                var script = document.createElement('script');
                script.id = "script_CkEditor";
                script.type = 'text/javascript';
                script.async = false;
                script.src = this.ExternalFiles.ckeditorjs || "";//'https://cdn.ckeditor.com/ckeditor5/41.2.1/classic/ckeditor.js'; // Replace with the actual path to CKEditor script
                script.onload = this.initializeCKEditor; // Initialize CKEditor after script is loaded
                document.head.appendChild(script); // Append the script element to the document
            }
        }
        
        if (typeof window.Quill === 'undefined') {
            var css_QuillEditor = document.getElementById('css_QuillEditor');
            if (!css_QuillEditor) {
                // QuillEditor script is not loaded, load it dynamically
                var css = document.createElement('link');
                css.id = "css_QuillEditor";
                //css.type = 'text/javascript';
                css.rel = "stylesheet";
                css.href = this.ExternalFiles.quillcss || "";'https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.5/dist/quill.snow.css'; // Replace with the actual path to QuillEditor script
                document.head.appendChild(css); // Append the script element to the document
            }

            var script_QuillEditor = document.getElementById('script_QuillEditor');
            if (!script_QuillEditor) {
                // QuillEditor script is not loaded, load it dynamically
                var script1 = document.createElement('script');
                script1.id = "script_QuillEditor";
                script1.type = 'text/javascript';
                script1.async = false;
                script1.src = this.ExternalFiles.quilljs || "";//'https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.5/dist/quill.js'; // Replace with the actual path to QuillEditor script
                script1.onload = this.initializeQuillEditor; // Initialize CKEditor after script is loaded
                document.head.appendChild(script1); // Append the script element to the document
            }
        }
    }

    initializeCKEditor() {
        // Check if ClassicEditor is available
        if (typeof window.ClassicEditor !== 'undefined') {
            // Now you can use ClassicEditor
            console.log("CKEditor loaded successfully!");
        } else {
            console.error("CKEditor failed to load!");
        }
    }

    initializeQuillEditor() {
        // Check if QuillEditor is available
        if (typeof window.ClassicEditor !== 'undefined') {
            // Now you can use QuillEditor
            console.log("QuillEditor loaded successfully!");
        } else {
            console.error("QuillEditor failed to load!");
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
        this.container = container;
        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
        this.RecordId = (context.mode as any).contextInfo.entityId;
        
        this.ReadOnly = this.ToBoolean(context.parameters.ReadOnly.raw || "");
        this.ThemeName = context.parameters.ThemeName.raw || "Default";
        this.GetMode(context.parameters.Mode.raw || "");
        this.ExternalFiles = JSON.parse(context.parameters.ExternalFiles.raw || "{}");
        this.initializeExternalScripts();

        if(this.IsForm) {
            this.SurveyModelData = context.parameters.SurveyModelData.raw || "{}";
            this.SurveyData = context.parameters.SurveyData.raw || "{}";
            this.ReturnNoData = this.ToBoolean(context.parameters.ReturnNoData.raw || "");
            //this.Completed = this.ToBoolean((context.parameters.Completed.raw || "No")); //Set the default value as 'No' for TwoOption field
            this.SaveAsPdf = this.ToBoolean(context.parameters.SaveAsPdf.raw || "false");
        
            // Parse JSON and render controls
            this.RenderControls();
        }
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        this.ReadOnly = this.ToBoolean(context.parameters.ReadOnly.raw || "");
        this.ThemeName = context.parameters.ThemeName.raw || "Default";
        this.GetMode(context.parameters.Mode.raw || "");

        if(this.IsFormCollection) {
            const Lookup = context.parameters.Lookup.raw;
            this.LookupId = Lookup[0].id;
            this.LookupType = Lookup[0].entityType;
            this.LookupName = Lookup[0].name;

            this.QueryParameters = (context.parameters.QueryParameters.raw || "").replace("{0}", this.LookupId);
            this.QueryEntity = context.parameters.QueryEntity.raw || "";
            this.FieldMapping = context.parameters.FieldMapping.raw || "";
            
            this.SurveyData = "{}";
            this.SurveyModelData = "{}";

            //Retrieve the related records.
            this.LoadRelatedRecords();
        }
        else if(this.IsForm) {
            this.SurveyModelData = context.parameters.SurveyModelData.raw || "{}";
            this.SurveyData = context.parameters.SurveyData.raw || "{}";
            this.ReturnNoData = this.ToBoolean(context.parameters.ReturnNoData.raw || "");
            //this.Completed = context.parameters.Completed.raw || "No"; //Set the default value as 'No' for TwoOption field
            //this.Completed = this.ToBoolean((context.parameters.Completed.raw || "No")); //Set the default value as 'No' for TwoOption field
            this.SaveAsPdf = this.ToBoolean(context.parameters.SaveAsPdf.raw || "false");
        
            // Parse JSON and render controls
            this.RenderControls();
        }
    }

    LoadRelatedRecords() {
        this.context.webAPI.retrieveMultipleRecords(this.QueryEntity, this.QueryParameters).then((response: any) => {
            this.OtherSurveys = response;
            this.RenderFormCollectionControls();
        })
        .catch((error: any) => {
            this.OtherSurveys = { "entities": [] };
            console.log("Error fetching related records: ", error);
            alert("Error fetching related records: " + JSON.stringify(error));
        });
    }

    private RenderFormCollectionControls() : void {
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
                    this.SurveyModelData = "{}";
                    this.SurveyData = "{}";
                    this.SurveyJsContainer.style.display = "none";
                }
                else {
                    // Find the corresponding entity object from data.entities based on the selected value
                    const selectedEntity = this.OtherSurveys.entities.find((entity: any) => entity[config.ValueProperty] === selectedValue);

                    //Change the Logo size to 50px
                    try{
                        var ModelData = JSON.parse(selectedEntity[config.SurveyModel]);
                        ModelData.logoWidth = "50px";
                        ModelData.logoHeight = "50px";
                        this.SurveyModelData = JSON.stringify(ModelData);
                    } catch (error) {
                        this.SurveyModelData = selectedEntity[config.SurveyModel];
                    }
                    this.SurveyData = selectedEntity[config.SurveyResponse];
                    this.SurveyJsContainer.style.display = "block";
                }
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
                if (entity[config.ValueProperty] !== this.RecordId) {
                    var AllowItemToAdd = false;
                    //if((entity[config.ApplyFilterProperty] === undefined) || (this.ToBoolean(entity[config.ApplyFilterProperty] || "") && (entity[config.FilterIdProperty] === this.LookupId))) {
                    if(this.ToBoolean(config.ApplyFilterProperty || "") === false) {
                        AllowItemToAdd=true;
                    }
                    else if(entity[config.FilterIdProperty] === this.LookupId) {
                        AllowItemToAdd=true;
                    }

                    if(AllowItemToAdd){
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
                }
            });

            DropdownContainer.appendChild(LabelContainer);
            DropdownContainer.appendChild(SelectContainer);
            this.container.appendChild(DropdownContainer);
            this.RenderSurveyControl();
        }
    }

    RenderSurveyControl() {
        try {
            this.oParam.SurveyModelData = JSON.parse(this.SurveyModelData);
            //this.oParam.SurveyPdfModelData = JSON.parse(this.SurveyModelData).pages;
            //this.oParam.SurveyPdfModelData = "{\"pages\":" + JSON.stringify(JSON.parse(this.SurveyModelData).pages) + "}";//JSON.parse(this.SurveyModelData).pages;
        } catch (error) {
            console.log("Error parsing JSON:", error);
            this.oParam.SurveyModelData = "{}";
            //this.oParam.SurveyPdfModelData = "{}";
        }
        try {
            this.oParam.SurveyData = JSON.parse(this.SurveyData);
        } catch (error) {
            console.log("Error parsing JSON:", error);
            this.oParam.SurveyData = "{}";
        }
        this.oParam.ReadOnly = this.ReadOnly;
        this.oParam.ThemeName = this.ThemeName;
        this.oParam.EnableSaveAsPdf = this.SaveAsPdf;

        if(this.SurveyJsContainer === undefined) {            
            this.SurveyJsContainer = document.createElement('div');
            this.SurveyJsContainer.style.display = "none";
            this.container.appendChild(this.SurveyJsContainer);
        }
        try{
            this.rootControl = createRoot(this.SurveyJsContainer);
            this.rootControl.render(
                React.createElement(SurveyJsFormPcfComponent, this.oParam)
            );
        } catch (error) {
            console.log("Error Loading the SurveyJS component: ", error);
            alert("Error Loading the SurveyJS component: " + JSON.stringify(error));
        }
    }

    private GetMode(strInput: string) {
        switch(strInput.toLowerCase().trim()) {
            case "form":
                this.IsForm = true;
                break;
            case "formcollection":
                this.IsFormCollection = true;
                break;
        }
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

    private RenderControls(): void {
        try {
            this.oParam.SurveyModelData = JSON.parse(this.SurveyModelData);
            //this.oParam.SurveyPdfModelData = JSON.stringify(JSON.parse(this.SurveyModelData).pages);//JSON.parse(this.SurveyModelData).pages;
            //this.oParam.SurveyPdfModelData = "{\"pages\":" + JSON.stringify(JSON.parse(this.SurveyModelData).pages) + "}";//JSON.parse(this.SurveyModelData).pages;
        } catch (error) {
            console.log("Error parsing JSON:", error);
            this.oParam.SurveyModelData = "{}";
            //this.oParam.SurveyPdfModelData = "{}";
        }
        try {
            this.oParam.SurveyData = JSON.parse(this.SurveyData);
        } catch (error) {
            console.log("Error parsing JSON:", error);
            this.oParam.SurveyData = "{}";
        }
        this.oParam.ReadOnly = this.ReadOnly;
        this.oParam.ThemeName = this.ThemeName;
        this.oParam.EnableSaveAsPdf = this.SaveAsPdf;

        if(this.rootControl === undefined)
        {
            this.rootControl = createRoot(this.container);
        }
        this.rootControl.render(React.createElement(
            SurveyJsFormPcfComponent,
            this.oParam
        ));
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return { SurveyData: this.SurveyData, Completed: this.Completed } as IOutputs;
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
