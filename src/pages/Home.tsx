import { useState } from "react";
import Map, { NavigationControl } from "react-map-gl/mapbox";
import { Tabs, Select, Input, Button, ConfigProvider, Table, Modal, Tag, Progress } from "antd";
import { SearchOutlined, FilterOutlined, DownOutlined, UpOutlined, HistoryOutlined, InfoCircleOutlined } from "@ant-design/icons";

import { config } from "~/config";
import { GatewayCard, NetworkNode, NetworkNodeLarge, LatencyBadge } from "~/components";
import {
  regionOptions,
  ebrOptions,
  gatewayOptions,
  dateOptions,
  routingTableData,
  routingTableColumns,
  historyRoutingData,
  transportBundleData,
} from "~/data/routingData";

import "./Home.css";

import warning from "~/assets/warning.webp";

type TabId = "cti-routing" | "routing-on-demand";

const INITIAL_VIEW = {
  longitude: 117.5,
  latitude: -2.5,
  zoom: 4.5,
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
  const [viewState, setViewState] = useState(INITIAL_VIEW);

  const tabItems = [
    {
      key: "cti-routing",
      label: "CTI Routing",
      children: (
        <CTIRoutingContent
          viewState={viewState}
          setViewState={setViewState}
        />
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
      <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
        {/* Header */}
        <header className="px-4 pt-5 flex items-center justify-between gradient-border-b">
          {/* Tabs */}
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

        {/* Content */}
        <div className="flex-1 flex flex-col tab-content" key={activeTab}>
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

// CTI Routing Tab Content
function CTIRoutingContent({
  viewState,
  setViewState,
}: {
  viewState: typeof INITIAL_VIEW;
  setViewState: (v: typeof INITIAL_VIEW) => void;
}) {
  return (
    <>
      {/* Filter Bar */}
      <div className="px-4 py-3 flex items-center gap-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-[#00838f]">Date:</span>
          <span>8-12-2025</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-[#00838f]">Hour:</span>
          <span>06:00 WIB</span>
        </div>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          shape="round"
          className="!bg-[#00838f]"
        >
          Filter
        </Button>
        <div className="ml-auto text-sm text-[#00838f] underline cursor-pointer hover:text-[#005a7f]">
          Routing Reference Best Path
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-gray-200 p-4 flex flex-col gap-4">
          {/* Nation Wide Stats */}
          <div>
            <h3 className="text-[#00838f] font-bold text-sm mb-3">
              NATION WIDE
            </h3>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xs">
                <span className="text-red-500 font-bold">28</span> Link{" "}
                <span className="text-gray-500">DEGRADED</span>
              </span>
              <span className="text-xs">
                <span className="text-yellow-500 font-bold">10</span> Link{" "}
                <span className="text-gray-500">IMPROVE</span>
              </span>
            </div>

            {/* Donut Chart */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  fill="none"
                  stroke="#00838f"
                  strokeWidth="12"
                  strokeDasharray="280"
                  strokeDashoffset="30"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#00838f]">308</span>
                <span className="text-xs text-gray-500">Link</span>
                <span className="text-xs text-gray-500">EBR to GW</span>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-green-500 font-semibold">
                270 Link
              </span>
              <span className="text-xs text-gray-500 ml-1">MAINTAIN</span>
            </div>
          </div>

          {/* Gateway Section */}
          <div>
            <h3 className="text-[#00838f] font-bold text-sm mb-3">GATEWAY</h3>
            <div className="flex flex-col gap-2">
              <GatewayCard name="BTC" percentage={82} color="#00838f" />
              <GatewayCard name="BDS" percentage={82} color="#00838f" />
              <GatewayCard name="PNK" percentage={100} color="#00838f" />
              <GatewayCard name="JT" percentage={100} color="#00838f" />
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {/* Link Route CTI Header */}
          <div className="absolute top-4 left-4 right-4 z-10 bg-white/95 rounded-lg shadow-lg p-4">
            <h3 className="text-[#00838f] font-bold text-sm mb-3">
              LINK ROUTE CTI
            </h3>
            <div className="flex items-center justify-between text-xs mb-2">
              <span>
                Latency End-to-End:{" "}
                <span className="bg-[#00838f] text-white px-2 py-0.5 rounded">
                  31 ms
                </span>
              </span>
              <span className="text-yellow-600 flex items-center gap-1">
                Asymmetric <span className="text-yellow-500">⚠️</span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <NetworkNode label="EBR" type="router" />
              <LatencyBadge value="1 ms" />
              <NetworkNode label="PE TRANSIT" type="switch" />
              <LatencyBadge value="1 ms" />
              <NetworkNode label="P" type="switch" />
              <LatencyBadge value="1 ms" />
              <NetworkNode label="Cloud IPBB Telkom" type="cloud" />
              <LatencyBadge value="13 ms" />
              <NetworkNode label="IGW/DGW" type="router" />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>← Uplink</span>
              <span>Downlink →</span>
            </div>
          </div>

          {/* Map */}
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState as typeof INITIAL_VIEW)}
            mapboxAccessToken={config.mapbox.accessToken}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            attributionControl={false}
            projection={{ name: "mercator" }}
          >
            <NavigationControl position="bottom-right" />
          </Map>

          {/* Territory Marker */}
          <div className="absolute bottom-20 left-1/4 bg-white rounded-lg shadow-lg p-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#00838f] font-bold">TERRITORY 1</span>
              <span className="bg-green-500 text-white px-1 rounded text-[10px]">
                100%
              </span>
            </div>
            <div className="text-yellow-600 font-bold">18 EBR</div>
          </div>
        </div>
      </div>
    </>
  );
}

// Routing On Demand Tab Content
function RoutingOnDemandContent() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    "01-Sumbagut",
    "02-Sumbagsel",
  ]);
  const [selectedEBR, setSelectedEBR] = useState<string[]>(["AHZ.1", "AHZ.2"]);
  const [selectedGateway, setSelectedGateway] = useState<string[]>([
    "BTC",
    "BDS",
  ]);
  const [selectedDate, setSelectedDate] = useState<string[]>([
    "1-5 December 2025",
  ]);

  // Slide 2 Content - Routing Reference Best Path
  if (slideIndex === 1) {
    return <RoutingReferenceBestPathSlide onBack={() => setSlideIndex(0)} />;
  }


  return (
    <>
      {/* Filter Bar */}
      <div className="px-4 py-3 grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <label className="text-xs text-gray-500 block mb-1">Region</label>
          <Select
            mode="multiple"
            placeholder="Select Region"
            value={selectedRegions}
            onChange={setSelectedRegions}
            options={regionOptions}
            style={{ width: "100%" }}
            maxTagCount="responsive"
            className="custom-select"
            classNames={{ popup: { root: "custom-select-dropdown" } }}
          />
        </div>
        <div className="col-span-3">
          <label className="text-xs text-gray-500 block mb-1">EBR</label>
          <Select
            mode="multiple"
            placeholder="Select EBR"
            value={selectedEBR}
            onChange={setSelectedEBR}
            options={ebrOptions}
            style={{ width: "100%" }}
            maxTagCount="responsive"
            className="custom-select"
            classNames={{ popup: { root: "custom-select-dropdown" } }}
          />
        </div>
        <div className="col-span-3">
          <label className="text-xs text-gray-500 block mb-1">Gateway</label>
          <Select
            mode="multiple"
            placeholder="Select Gateway"
            value={selectedGateway}
            onChange={setSelectedGateway}
            options={gatewayOptions}
            style={{ width: "100%" }}
            maxTagCount="responsive"
            className="custom-select"
            classNames={{ popup: { root: "custom-select-dropdown" } }}
          />
        </div>
        <div className="col-span-3">
          <label className="text-xs text-gray-500 block mb-1">Date</label>
          <Select
            mode="multiple"
            placeholder="Select Date"
            value={selectedDate}
            onChange={setSelectedDate}
            options={dateOptions}
            style={{ width: "100%" }}
            maxTagCount="responsive"
            className="custom-select"
            classNames={{ popup: { root: "custom-select-dropdown" } }}
          />
        </div>
      </div>

      {/* Check Routing Button */}
      <div className="px-4 py-3">
        <Button
          type="primary"
          size="middle"
          block
          className="check-routing-btn"
        >
          CHECK ROUTING
        </Button>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <span className="text-[#7f7f7f] font-bold">Latency EBR to IGW :</span>
          <span className="text-white px-2 py-0.5 rounded inline-block bg-gradient-to-r from-[#009688] to-[#1ecb6b]">
            31 ms
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[#7f7f7f] font-bold">Status :</span>
          <span className="text-yellow-600 font-bold font-italic">
            Asymmetric
          </span>
          <img src={warning} alt="Warning" className="w-4 h-4" />
        </div>
      </div>

      {/* Network Path Diagrams */}
      <div className="flex-1 p-6 overflow-auto space-y-6">
        {/* Uplink Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Arrow line with label */}
          <div className="relative flex items-center mb-6">
            <div className="flex-1 h-[2px] bg-[#00838f]" />
            <div className="absolute left-1/2 -translate-x-1/2 bg-white px-2">
              <span className="border border-gray-300 px-4 py-1 rounded-full text-sm font-medium text-gray-600">
                Uplink
              </span>
            </div>
            <div className="text-[#00838f] text-xl">→</div>
          </div>

          {/* Network nodes */}
          <div className="flex items-start justify-between px-4">
            <NetworkNodeLarge label="EBR" type="router" />
            <div
              className="flex-1 flex items-center justify-center relative mt-6"
            >
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="PE TRANSIT" type="switch" />
            <div
              className="flex-1 flex items-center justify-center relative mt-6"
            >
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="P 1" type="switch" />
            <div
              className="flex-1 flex items-center justify-center relative mt-6"
            >
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="Cloud IPBB Telkom" type="cloud" />
            <div
              className="flex-1 flex items-center justify-center relative mt-6"
            >
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                12 ms
              </span>
            </div>
            <NetworkNodeLarge label="IGW/DGW" type="router" />
          </div>
        </div>

        {/* Downlink Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Arrow line with label */}
          <div className="relative flex items-center mb-6">
            <div className="text-[#00838f] text-xl">←</div>
            <div className="flex-1 h-[2px] bg-[#00838f]" />
            <div className="absolute left-1/2 -translate-x-1/2 bg-white px-2">
              <span className="border border-gray-300 px-4 py-1 rounded-full text-sm font-medium text-gray-600">
                Downlink
              </span>
            </div>
          </div>

          {/* Network nodes */}
          <div className="flex items-start justify-between px-4">
            <NetworkNodeLarge label="EBR" type="router" />
            <div
              className="flex-1 flex items-center justify-center relative mt-6"
            >
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="PE TRANSIT" type="switch" />
            <div
              className="flex-1 flex items-center justify-center relative mt-6"
            >
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="P 2" type="switch" />
            <div
              className="flex-1 flex items-center justify-center relative mt-6"
            >
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="Cloud IPBB Telkom" type="cloud" />
            <div
              className="flex-1 flex items-center justify-center relative mt-6"
            >
              <div className="h-[2px] bg-[#f24b6a] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#f24b6a] to-[#ff6b6b] text-white px-3 py-0.5 rounded text-xs flex items-center gap-1">
                15 ms
                <span className="text-white">⚠</span>
              </span>
            </div>
            <NetworkNodeLarge label="IGW/DGW" type="router" />
          </div>
        </div>
      </div>

      {/* Slide Toggle Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={() => setSlideIndex(1)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <DownOutlined style={{ fontSize: 24 }} />
        </button>
      </div>
    </>
  );
}

// Routing Reference Best Path Slide (Slide 2)
function RoutingReferenceBestPathSlide({ onBack }: { onBack: () => void }) {
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const [selectedBundleKey, setSelectedBundleKey] = useState<string | null>(null);

  // Add status render and path click handler to columns
  const columnsWithStatus = [
    ...routingTableColumns.slice(0, 3), // No, EBR, PE EBR/Transit
    {
      title: "Path",
      dataIndex: "path",
      key: "path",
      ellipsis: true,
      render: (path: string, record: { key: string }) => (
        <span
          className="text-[#00838f] underline cursor-pointer hover:text-[#005a7f]"
          onClick={() => {
            setSelectedBundleKey(record.key);
            setBundleModalOpen(true);
          }}
        >
          {path} <InfoCircleOutlined />
        </span>
      ),
    },
    ...routingTableColumns.slice(4), // P, Uplink, Downlink, Total
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <span className={status === "Asymmetric" ? "text-yellow-600 font-bold" : "text-green-600"}>
          {status}
        </span>
      ),
    },
  ];

  // Get selected transport bundle data
  const selectedBundle = transportBundleData.find(b => b.ebrKey === selectedBundleKey);

  return (
    <>
      {/* History Routing Modal */}
      <Modal
        title={<span className="text-[#00838f] font-bold">Cell History Routing</span>}
        open={historyModalOpen}
        onCancel={() => setHistoryModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={historyRoutingData}
          size="small"
          pagination={{ pageSize: 5 }}
          columns={[
            { title: "Date", dataIndex: "date", key: "date", width: 100 },
            { title: "Time", dataIndex: "timestamp", key: "timestamp", width: 80 },
            {
              title: "Latency",
              dataIndex: "totalLatency",
              key: "totalLatency",
              width: 80,
              render: (val: number) => <span className="font-bold">{val} ms</span>,
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              width: 80,
              render: (status: string) => (
                <Tag color={status === "Normal" ? "green" : "red"}>{status}</Tag>
              ),
            },
            { title: "Path", dataIndex: "path", key: "path", ellipsis: true },
            { title: "Changes", dataIndex: "changes", key: "changes", ellipsis: true },
          ]}
        />
      </Modal>

      {/* Transport Bundle Modal */}
      <Modal
        title={<span className="text-[#00838f] font-bold">Transport Bundle Details</span>}
        open={bundleModalOpen}
        onCancel={() => setBundleModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedBundle && (
          <div className="space-y-4">
            {selectedBundle.bundles.map(bundle => (
              <div key={bundle.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[#00838f]">{bundle.name}</span>
                  <Tag color={
                    bundle.status === "Active" ? "green" :
                      bundle.status === "Standby" ? "orange" : "red"
                  }>
                    {bundle.status}
                  </Tag>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                  <div><span className="text-gray-500">ID:</span> {bundle.id}</div>
                  <div><span className="text-gray-500">Type:</span> {bundle.type}</div>
                  <div><span className="text-gray-500">Capacity:</span> {bundle.capacity}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Utilization:</span>
                  <Progress
                    percent={bundle.utilization}
                    size="small"
                    status={bundle.utilization > 80 ? "exception" : "normal"}
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <UpOutlined style={{ fontSize: 16 }} />
        </button>
        <h2 className="text-lg font-bold text-[#00838f] border-b-2 border-[#00838f] pb-1">
          Routing Reference Best Path
        </h2>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-gray-600 font-medium">Best Latency:</span>
          <span className="bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-1 rounded text-sm font-bold">
            31 ms
          </span>
          <span className="text-yellow-600 font-bold italic">Asymmetric</span>
          <img src={warning} alt="Warning" className="w-5 h-5" />
          <div
            className="flex items-center gap-2 text-[#00838f] cursor-pointer ml-4 hover:text-[#005a7f]"
            onClick={() => setHistoryModalOpen(true)}
          >
            <span className="underline">Cell History Routing</span>
            <HistoryOutlined />
          </div>
        </div>
      </div>

      {/* Network Diagram - Combined Uplink and Downlink */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            {/* Uplink */}
            <NetworkNodeLarge label="EBR" type="router" />
            <div className="flex-1 flex items-center justify-center relative mt-6">
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="PE TRANSIT" type="switch" />
            <div className="flex-1 flex items-center justify-center relative mt-6">
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="P" type="switch" />
            <div className="flex-1 flex items-center justify-center relative mt-6">
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                12 ms
              </span>
            </div>
            <NetworkNodeLarge label="Cloud IPBB Telkom" type="cloud" />
            <div className="flex-1 flex items-center justify-center relative mt-6">
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                12 ms
              </span>
            </div>
            <NetworkNodeLarge label="IGW/DGW" type="router" />
            {/* Downlink */}
            <div className="flex-1 flex items-center justify-center relative mt-6">
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                12 ms
              </span>
            </div>
            <NetworkNodeLarge label="Cloud IPBB Telkom" type="cloud" />
            <div className="flex-1 flex items-center justify-center relative mt-6">
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="P" type="switch" />
            <div className="flex-1 flex items-center justify-center relative mt-6">
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="PE TRANSIT" type="switch" />
            <div className="flex-1 flex items-center justify-center relative mt-6">
              <div className="h-[2px] bg-[#00838f] flex-1" />
              <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                1 ms
              </span>
            </div>
            <NetworkNodeLarge label="EBR" type="router" />
          </div>

          {/* Direction labels */}
          <div className="flex justify-between mt-4 px-8">
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2 text-[#00838f] font-medium border-b-2 border-[#00838f] pb-1">
                <span>Uplink</span>
                <span>→</span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2 text-[#00838f] font-medium border-b-2 border-[#00838f] pb-1">
                <span>Downlink</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-4 py-2 flex-1 overflow-auto">
        <div className="bg-white rounded-xl shadow-md">
          <Table
            columns={columnsWithStatus}
            dataSource={routingTableData}
            bordered
            size="small"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </div>
      </div>

      {/* Slide Toggle Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <UpOutlined style={{ fontSize: 24 }} />
        </button>
      </div>
    </>
  );
}
