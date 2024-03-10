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

export interface SurveyJsFormPcfProps {
    SurveyModelData: string;
    SurveyRecordId: string;
    SurveyData: string;
    onValueChanged: (strJson: string) => {};
    ReadOnly: boolean;
}

export class SurveyJsFormPcfComponent extends React.Component<SurveyJsFormPcfProps> {
    SurveyModel: Model;
    SurveyData: string;
    SurveyRecordId: string;
    constructor(props: SurveyJsFormPcfProps) {
        super(props);
        console.log("SurveyJsFormPcfProps: constructor called.");
        this.SurveyRecordId = this.props.SurveyRecordId;
        this.SurveyData = this.props.SurveyData;
        this.SurveyModel = new Model(this.props.SurveyModelData);
        this.SurveyModel.data = this.SurveyData;

        console.log(this.SurveyRecordId);

        if(this.props.ReadOnly) {
            this.SurveyModel.mode = "display";
        }

        this.SurveyModel.onComplete.add((sender) => {
            this.SurveyData = sender.data;
            this.props.onValueChanged(JSON.stringify(this.SurveyData));
        });

        this.SurveyModel.onValueChanged.add((sender) => {
            this.SurveyData = sender.data;
            this.props.onValueChanged(JSON.stringify(this.SurveyData));
        });

        this.SurveyModel.onCurrentPageChanged.add((sender: any) => {
            this.SurveyData = sender.data;
            this.props.onValueChanged(JSON.stringify(this.SurveyData));
        });
    }

    render() {
      console.log("Child component rendered.");
      return <Survey model={this.SurveyModel} />;
    }
}