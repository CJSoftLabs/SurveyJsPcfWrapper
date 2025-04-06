import * as React from 'react';
import { TextField, Pivot, PivotItem, Icon } from '@fluentui/react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Include Quill styles

// Define types
type ToolbarConfigType = "basic" | "full" | "minimal";

export interface TabConfig {
    name: string;
    label: string;
    useRichText?: boolean;
    toolbarConfig?: ToolbarConfigType;
    iconName?: string; // Fluent UI icon name
    customIcon?: React.ReactNode; // Fallback JSX
    rowCount: number;
    rteHeight: number;
    readOnly: boolean;
}

export interface TabbedNotesProps {
    UiConfig: TabConfig[];
    data: { [tabName: string]: string };
    onEdit: (updatedData: { [tabName: string]: string }) => void;
    isReadOnly: boolean;
}

interface TabbedNotesState {
    selectedTab: string;
    localData: { [tabName: string]: string };
}

// Toolbar configurations
const TOOLBARS: Record<ToolbarConfigType, any> = {
    basic: [
      ["bold", "italic", "underline"],
      [{ list: "bullet" }, { list: "ordered" }],
    ],
    full: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
    minimal: [["bold", "italic"]],
  };

export class TabbedNotesControl extends React.Component<TabbedNotesProps, TabbedNotesState> {
    constructor(props: TabbedNotesProps) {
        super(props);
        const firstTab = props.UiConfig.length > 0 ? props.UiConfig[0].name : 'default';
        this.state = {
            selectedTab: firstTab,
            localData: { ...props.data },
        };
    }

    handleTabChange = (tabName: string) => {
        this.setState({ selectedTab: tabName });
    };

    handleTextChange = (tabName: string, value?: string) => {
        const updatedValue = value ?? '';
        this.setState(
            (prevState) => ({
                localData: {
                    ...prevState.localData,
                    [tabName]: updatedValue,
                },
            }),
            () => this.props.onEdit(this.state.localData)
        );
    };

    render() {
        const { selectedTab, localData } = this.state;
        const { UiConfig } = this.props;

        const currentTabConfig = UiConfig.find((tab) => tab.name === selectedTab);
        const readOnly = currentTabConfig?.readOnly ?? false;

        return (
            <Pivot
                selectedKey={selectedTab}
                onLinkClick={(item) => item && this.handleTabChange(item.props.itemKey!)}
                linkSize={"normal"}
            >
                {UiConfig.map(tab => (
                    <PivotItem headerText={tab.label || tab.name} itemKey={tab.name} key={tab.name}
                    // This makes Fluent UI show the icon automatically if iconName is set
                    itemIcon={tab.iconName}
                    // Optional: override icon and text rendering manually
                    headerButtonProps={
                      tab.iconName || tab.customIcon
                        ? {
                            children: (
                              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                {tab.iconName ? (
                                  <Icon iconName={tab.iconName} />
                                ) : (
                                  tab.customIcon
                                )}
                                {tab.label ?? `Tab ${tab.name}`}
                              </span>
                            ),
                          }
                        : undefined
                    }>
                        <div style={{ marginTop: 10 }}>
                            {tab.useRichText ? (
                            <ReactQuill
                                theme="snow"
                                value={localData[tab.name] || ""}
                                onChange={(value) => this.handleTextChange(tab.name, value)}
                                modules={{ 
                                    toolbar: TOOLBARS[tab.toolbarConfig ?? "basic"] 
                                  }}
                                style={{ minHeight: `${tab.rteHeight || 200}px`, height: `${tab.rteHeight || 200}px` }}
                                readOnly={readOnly || this.props.isReadOnly}
                            />
                            ) : (
                            <TextField
                                multiline
                                rows={tab.rowCount || 10}
                                value={localData[tab.name] || ""}
                                onChange={(_, newValue) => this.handleTextChange(tab.name, newValue || "")}
                                styles={{ root: { marginTop: 10, width: "100%" } }}
                                readOnly={readOnly || this.props.isReadOnly}
                            />
                            )}
                        </div>
                    </PivotItem>
                ))}
            </Pivot>
        );
    }
}
