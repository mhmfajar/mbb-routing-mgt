import { useState } from "react";
import { Tabs, Input, ConfigProvider } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import {
  CTIRoutingContent,
  RoutingOnDemandContent,
  type ViewState,
} from "~/components";

import "./Home.css";

type TabId = "cti-routing" | "routing-on-demand";

const INITIAL_VIEW: ViewState = {
  longitude: 117.969,
  latitude: -2.494,
  zoom: 4.275,
  pitch: 0,
  bearing: 0,
};

// Ant Design theme customization
const antTheme = {
  token: {
    colorPrimary: "#0067e6",
    borderRadius: 6,
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("cti-routing");
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW);

  const tabItems = [
    {
      key: "cti-routing",
      label: "CTI Routing",
      children: (
        <CTIRoutingContent viewState={viewState} setViewState={setViewState} />
      ),
    },
    {
      key: "routing-on-demand",
      label: "Routing On Demand",
      children: <RoutingOnDemandContent />,
    },
  ];

  return (
    <ConfigProvider theme={antTheme}>
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        {/* Header */}
        <header className="px-4 pt-5 flex items-center justify-between gradient-border-b h-[62px] relative z-20 bg-[#f5f5f5]">
          {/* Tabs - Only labels, no children */}
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as TabId)}
            type="card"
            className="custom-tabs"
            items={tabItems.map((item) => ({
              key: item.key,
              label: item.label,
            }))}
          />
          {/* Search */}
          <Input
            placeholder="Search"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-48 custom-search mb-2"
            size="small"
          />
        </header>

        {/* Content - Rendered separately with proper flex container */}
        <div className="flex-1 flex flex-col tab-content">
          {activeTab === "cti-routing" ? (
            <CTIRoutingContent
              viewState={viewState}
              setViewState={setViewState}
            />
          ) : (
            <RoutingOnDemandContent />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
