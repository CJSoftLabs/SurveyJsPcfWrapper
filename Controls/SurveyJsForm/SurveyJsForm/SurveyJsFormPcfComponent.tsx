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

import React from "react";
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import * as SurveyTheme from 'survey-core/themes';
import { RegisterQuillRteToolboxItem, RegisterQuillRteComponent } from './QuillRteComponent';
import { RegisterCkEditorRteToolboxItem, RegisterCkEditorRteComponent } from './CkEditorRteComponent';
import { HorizontalAlign, SurveyPDF, VerticalAlign } from "survey-pdf";

RegisterQuillRteToolboxItem();
RegisterQuillRteComponent();
RegisterCkEditorRteToolboxItem();
RegisterCkEditorRteComponent();

export interface SurveyJsFormPcfProps {
    SurveyModelData: string;
    ThemeName: string;
    SurveyData: string;
    onValueChanged: (strJson: string, bCompleted: boolean) => {};
    ReadOnly: boolean;
    EnableSaveAsPdf: boolean;
}

export class SurveyJsFormPcfComponent extends React.Component<SurveyJsFormPcfProps> {
    SurveyModel: Model;
    SurveyData: string;
    //SurveyPdfModel: JSON;
    ThemeName: string;
    ThemeObjects: any;
    
    constructor(props: SurveyJsFormPcfProps) {
        super(props);
        this.ThemeObjects = {
            DefaultLight: SurveyTheme.DefaultLight,
            DefaultDark: SurveyTheme.DefaultDark,
            DefaultLightPanelless: SurveyTheme.DefaultLightPanelless,
            DefaultDarkPanelless: SurveyTheme.DefaultDarkPanelless,
            SharpLight: SurveyTheme.SharpLight,
            SharpDark: SurveyTheme.SharpDark,
            SharpLightPanelless: SurveyTheme.SharpLightPanelless,
            SharpDarkPanelless: SurveyTheme.SharpDarkPanelless,
            BorderlessLight: SurveyTheme.BorderlessLight,
            BorderlessDark: SurveyTheme.BorderlessDark,
            BorderlessLightPanelless: SurveyTheme.BorderlessLightPanelless,
            BorderlessDarkPanelless: SurveyTheme.BorderlessDarkPanelless,
            FlatLight: SurveyTheme.FlatLight,
            FlatDark: SurveyTheme.FlatDark,
            FlatLightPanelless: SurveyTheme.FlatLightPanelless,
            FlatDarkPanelless: SurveyTheme.FlatDarkPanelless,
            PlainLight: SurveyTheme.PlainLight,
            PlainDark: SurveyTheme.PlainDark,
            PlainLightPanelless: SurveyTheme.PlainLightPanelless,
            PlainDarkPanelless: SurveyTheme.PlainDarkPanelless,
            DoubleBorderLight: SurveyTheme.DoubleBorderLight,
            DoubleBorderDark: SurveyTheme.DoubleBorderDark,
            DoubleBorderLightPanelless: SurveyTheme.DoubleBorderLightPanelless,
            DoubleBorderDarkPanelless: SurveyTheme.DoubleBorderDarkPanelless,
            LayeredLight: SurveyTheme.LayeredLight,
            LayeredDark: SurveyTheme.LayeredDark,
            LayeredLightPanelless: SurveyTheme.LayeredLightPanelless,
            LayeredDarkPanelless: SurveyTheme.LayeredDarkPanelless,
            SolidLight: SurveyTheme.SolidLight,
            SolidDark: SurveyTheme.SolidDark,
            SolidLightPanelless: SurveyTheme.SolidLightPanelless,
            SolidDarkPanelless: SurveyTheme.SolidDarkPanelless,
            ThreeDimensionalLight: SurveyTheme.ThreeDimensionalLight,
            ThreeDimensionalDark: SurveyTheme.ThreeDimensionalDark,
            ThreeDimensionalLightPanelless: SurveyTheme.ThreeDimensionalLightPanelless,
            ThreeDimensionalDarkPanelless: SurveyTheme.ThreeDimensionalDarkPanelless,
            ContrastLight: SurveyTheme.ContrastLight,
            ContrastDark: SurveyTheme.ContrastDark,
            ContrastLightPanelless: SurveyTheme.ContrastLightPanelless,
            ContrastDarkPanelless: SurveyTheme.ContrastDarkPanelless
            };
        this.SurveyData = this.props.SurveyData;
        this.SurveyModel = new Model(this.props.SurveyModelData);
        this.ThemeName = this.props.ThemeName;
        this.SurveyModel.data = this.SurveyData;
        this.SurveyModel.applyTheme(this.GetTheme(this.ThemeName));
        //this.SurveyPdfModel = JSON.parse(this.props.SurveyModelData).Pages;

        if(this.props.ReadOnly) {
            this.SurveyModel.mode = "display";
        }
        else {
            this.SurveyModel.onComplete.add((sender) => {
                this.SurveyData = sender.data;
                this.props.onValueChanged(JSON.stringify(this.SurveyData), true);
            });

            this.SurveyModel.onValueChanged.add((sender) => {
                this.SurveyData = sender.data;
                this.props.onValueChanged(JSON.stringify(this.SurveyData), false);
            });

            this.SurveyModel.onCurrentPageChanged.add((sender: any) => {
                this.SurveyData = sender.data;
                this.props.onValueChanged(JSON.stringify(this.SurveyData), false);
            });
        }

        if(this.props.EnableSaveAsPdf) {
            this.SurveyModel.addNavigationItem({
                id: "survey_save_as_file", title: "Save as PDF", action: () => { this.SaveSurveyToPdf("surveyResult.pdf"); }
            });
        }
    }

    SaveSurveyToPdf(filename: any) {
        this.CreateSurveyPdfModel().save(filename);
    }

    CreateSurveyPdfModel() {
    
        let pdfWidth = !!this.SurveyModel && this.SurveyModel.pdfWidth ? this.SurveyModel.pdfWidth : 210;
        let pdfHeight = !!this.SurveyModel && this.SurveyModel.pdfHeight ? this.SurveyModel.pdfHeight : 297;
        let options = {
            fontSize: 14,
            margins: {
                left: 10,
                right: 10,
                top: 25,
                bot: 10
            },            
            format: [pdfWidth, pdfHeight]
        };
        const SurveyPdfModelData = "{\"pages\":" + JSON.stringify(this.SurveyModel.pages) + "}";
        const surveyPDF = new SurveyPDF(SurveyPdfModelData, options);
        surveyPDF.haveCommercialLicense=true;
        surveyPDF.title = this.SurveyModel.title;
        surveyPDF.description = this.SurveyModel.description;
        surveyPDF.showTitle = false;
    
        // Adds the logo to the header area
        surveyPDF.onRenderHeader.add(async function (_, canvas) {
            if((_.title !== undefined) && (_.title !== "undefined") && (_.title !== null) && (_.title !== "")) {
                canvas.drawText({
                    text: _.title,
                    fontSize: 16,
                    isBold: true,
                    horizontalAlign: HorizontalAlign.Left,
                    verticalAlign: VerticalAlign.Top,
                    margins: {
                        right: 12,
                        top: 10,
                        bot: 12,
                        left: 12
                    }
                });
            }

            if((_.description !== undefined) && (_.description !== "undefined") && (_.description !== null) && (_.description !== "")) {
                canvas.drawText({
                    text: _.description,
                    fontSize: 12,
                    horizontalAlign: HorizontalAlign.Left,
                    verticalAlign: VerticalAlign.Top,
                    margins: {
                        right: 12,
                        top: 40,
                        bot: 12,
                        left: 12
                    }
                });
            }
        });

        // Adds custom text and page information to the footer area
        surveyPDF.onRenderFooter.add((_, canvas) => {
            canvas.drawText({
                text: "Page " + canvas.pageNumber + " of " + canvas.pageCount,
                fontSize: 10,
                horizontalAlign: HorizontalAlign.Center,
                verticalAlign: VerticalAlign.Bottom,
                margins: {
                    right: 12,
                    top: 12,
                    bot: 12,
                    left: 12
                }
            });
        });
        
        if (this.SurveyModel) {
            surveyPDF.data = this.SurveyModel.data;
        }
        
        return surveyPDF;
    }

    GetTheme(ThemeName: string) {
        return this.ThemeObjects[ThemeName] ?? SurveyTheme.SharpLight;
    }

    render() {
      return <Survey model={this.SurveyModel} />;
    }
}