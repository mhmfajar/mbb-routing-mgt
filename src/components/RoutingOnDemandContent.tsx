import { useState, useEffect, useCallback } from "react";
import { Select, Button, Table, Modal, Tag, Progress, DatePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import {
  DownOutlined,
  UpOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import { config } from "~/config";

import { NetworkNodeLarge } from "~/components";
import {
  regionOptions,
  ebrOptionsByRegion,
  gatewayOptions,
  routingTableData,
  historyRoutingData,
  transportBundleData,
} from "~/data/routingData";

import warning from "~/assets/warning.webp";

// Types for Filter Route API Response
interface PathSegment {
  from: string;
  to: string;
  value: string;
}

interface UplinkEntry {
  region: string;
  tera: string;
  target: string;
  date_: string;
  hour_: number;
  ebr: string;
  latency_ebr: number;
  transit: string;
  path: string;
  type: string;
  paths: PathSegment[];
  information: InformationEntry;
}

interface DownlinkEntry {
  region: string;
  tera: string;
  ip_address: string;
  target: string;
  date_: string;
  hour_: number;
  ebr: string;
  latency: number;
  transit: string;
  path: string;
  type: string;
  paths: PathSegment[];
}

interface InformationEntry {
  latency_ebr_gw: number;
  status_symmetric: string;
}

// New grouped structure
interface GroupedRouteEntry {
  uplink: UplinkEntry | null;
  downlink: DownlinkEntry | null;
  information: InformationEntry | null;
}

interface FilterRouteApiData {
  uplink: UplinkEntry[];
  downlink: DownlinkEntry[];
}

interface FilterRouteResponse {
  status: boolean;
  data: FilterRouteApiData;
}

function getSourceType(value: string, isLast: boolean) {
  if (isLast) return "router";
  if (value.startsWith("EBR")) return "router";
  if (value.startsWith("P")) return "switch";
  return "unknown";
}

function mapRoutingData(data: PathSegment[]) {
  const result = [] as Array<{ value: string; source: string }>;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    // 'from' node
    if (i === 0) {
      result.push({
        value: item.from,
        source: getSourceType(item.from, false),
      });
    }
    // 'line' value
    result.push({ value: item.value, source: "line" });
    // 'to' node
    const isLast = i === data.length - 1;
    result.push({ value: item.to, source: getSourceType(item.to, isLast) });
  }
  return result;
}

// Routing Reference Best Path Slide (Slide 2)
function RoutingReferenceBestPathSlide({ onBack }: { onBack: () => void }) {
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const [selectedBundleKey, setSelectedBundleKey] = useState<string | null>(
    null
  );

  const selectedBundle = transportBundleData.find(
    (b) => b.ebrKey === selectedBundleKey
  );

  return (
    <>
      {/* History Routing Modal */}
      <Modal
        title={
          <span className="text-[#00838f] font-bold">Cell History Routing</span>
        }
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
            {
              title: "Time",
              dataIndex: "timestamp",
              key: "timestamp",
              width: 80,
            },
            {
              title: "Latency",
              dataIndex: "totalLatency",
              key: "totalLatency",
              width: 80,
              render: (val: number) => (
                <span className="font-bold">{val} ms</span>
              ),
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              width: 80,
              render: (status: string) => (
                <Tag color={status === "Normal" ? "green" : "red"}>
                  {status}
                </Tag>
              ),
            },
            { title: "Path", dataIndex: "path", key: "path", ellipsis: true },
            {
              title: "Changes",
              dataIndex: "changes",
              key: "changes",
              ellipsis: true,
            },
          ]}
        />
      </Modal>

      {/* Transport Bundle Modal */}
      <Modal
        title={
          <span className="text-[#00838f] font-bold">
            Transport Bundle Details
          </span>
        }
        open={bundleModalOpen}
        onCancel={() => setBundleModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedBundle && (
          <div className="space-y-4">
            {selectedBundle.bundles.map((bundle) => (
              <div key={bundle.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[#00838f]">
                    {bundle.name}
                  </span>
                  <Tag
                    color={
                      bundle.status === "Active"
                        ? "green"
                        : bundle.status === "Standby"
                          ? "orange"
                          : "red"
                    }
                  >
                    {bundle.status}
                  </Tag>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                  <div>
                    <span className="text-gray-500">ID:</span> {bundle.id}
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span> {bundle.type}
                  </div>
                  <div>
                    <span className="text-gray-500">Capacity:</span>{" "}
                    {bundle.capacity}
                  </div>
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

      {/* Network Diagram - Styled like reference */}
      <div className="p-6 bg-[#f5f5f5]">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mx-auto max-w-6xl">
          {/* Network diagram with proper layout */}
          <div className="flex items-end justify-center">
            {/* Uplink section */}
            <div className="flex items-end">
              <NetworkNodeLarge label="EBR" type="router" />
              <div className="flex flex-col items-center mx-1">
                <span className="bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-2 py-0.5 rounded text-[10px] font-semibold mb-1">
                  1 ms
                </span>
                <div className="h-[3px] bg-[#00838f] w-16" />
              </div>
              <NetworkNodeLarge label="PE TRANSIT" type="switch" />
              <div className="flex flex-col items-center mx-1">
                <span className="bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-2 py-0.5 rounded text-[10px] font-semibold mb-1">
                  1 ms
                </span>
                <div className="h-[3px] bg-[#00838f] w-16" />
              </div>
              <NetworkNodeLarge label="P" type="switch" />
              <div className="flex flex-col items-center mx-1">
                <span className="bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-2 py-0.5 rounded text-[10px] font-semibold mb-1">
                  12 ms
                </span>
                <div className="h-[3px] bg-[#00838f] w-16" />
              </div>
              <NetworkNodeLarge label="Cloud IPBB Telkom" type="cloud" />
              <div className="flex flex-col items-center mx-1">
                <span className="bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-2 py-0.5 rounded text-[10px] font-semibold mb-1">
                  12 ms
                </span>
                <div className="h-[3px] bg-[#00838f] w-16" />
              </div>
              <NetworkNodeLarge label="IGW/DGW" type="router" />
            </div>

            {/* Separator */}
            <div className="w-6" />

            {/* Downlink section */}
            <div className="flex items-end">
              <div className="flex flex-col items-center mx-1">
                <span className="bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-2 py-0.5 rounded text-[10px] font-semibold mb-1">
                  12 ms
                </span>
                <div className="h-[3px] bg-[#00838f] w-16" />
              </div>
              <NetworkNodeLarge label="Cloud IPBB Telkom" type="cloud" />
              <div className="flex flex-col items-center mx-1">
                <span className="bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-2 py-0.5 rounded text-[10px] font-semibold mb-1">
                  1 ms
                </span>
                <div className="h-[3px] bg-[#00838f] w-16" />
              </div>
              <NetworkNodeLarge label="P" type="switch" />
              <div className="flex flex-col items-center mx-1">
                <span className="bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-2 py-0.5 rounded text-[10px] font-semibold mb-1">
                  1 ms
                </span>
                <div className="h-[3px] bg-[#00838f] w-16" />
              </div>
              <NetworkNodeLarge label="PE TRANSIT" type="switch" />
              <div className="flex flex-col items-center mx-1">
                <span className="bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-2 py-0.5 rounded text-[10px] font-semibold mb-1">
                  1 ms
                </span>
                <div className="h-[3px] bg-[#00838f] w-16" />
              </div>
              <NetworkNodeLarge label="EBR" type="router" />
            </div>
          </div>

          {/* Direction labels */}
          <div className="flex justify-center mt-4 gap-32">
            <div className="flex items-center gap-1">
              <span className="text-[#00838f] font-semibold text-sm border-b-2 border-[#00838f] pb-0.5">
                Uplink
              </span>
              <span className="text-[#00838f] font-bold">→</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#00838f] font-semibold text-sm border-b-2 border-[#00838f] pb-0.5">
                Downlink
              </span>
              <span className="text-[#00838f] font-bold">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table - Split into two side-by-side tables like reference */}
      <div className="px-4 py-2 flex-1 overflow-auto">
        <div className="flex gap-4">
          {/* Left Table - Main info */}
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#004d7a] text-white">
                    <th className="px-2 py-1.5 text-left font-semibold border border-[#003a5c] w-8">
                      NO
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold border border-[#003a5c] min-w-[100px]">
                      EBR
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold border border-[#003a5c] min-w-[120px]">
                      PE-Transit
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold border border-[#003a5c] min-w-[280px]">
                      Path
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold border border-[#003a5c] w-10">
                      BDS
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold border border-[#003a5c] w-10">
                      BTC
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold border border-[#003a5c] w-10">
                      JT2
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold border border-[#003a5c] w-10">
                      PNK
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold border border-[#003a5c] w-14">
                      Grand Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {routingTableData.slice(0, 11).map((row, idx) => (
                    <tr
                      key={row.key}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-2 py-1 border border-gray-200 align-top text-xs">
                        {row.no}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 align-top font-medium text-xs">
                        {row.ebr}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 align-top text-xs">
                        {row.peTransit}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 align-top">
                        {row.paths.map((path, i) => (
                          <div
                            key={i}
                            className="py-0.5 text-[#00838f] cursor-pointer hover:text-[#005a7f] hover:underline text-xs leading-tight"
                            onClick={() => {
                              setSelectedBundleKey(row.key);
                              setBundleModalOpen(true);
                            }}
                          >
                            {path}{" "}
                            {i === 0 && (
                              <InfoCircleOutlined className="text-[10px]" />
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 text-center align-top text-sm font-bold text-gray-700">
                        {row.bds || ""}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 text-center align-top text-sm font-bold text-gray-700">
                        {row.btc || ""}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 text-center align-top text-sm font-bold text-gray-700">
                        {row.jt2 || ""}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 text-center align-top text-sm font-bold text-gray-700">
                        {row.pnk || ""}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 text-center align-top text-sm font-bold text-[#00838f]">
                        {row.grandTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Table - Continuation of rows */}
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#004d7a] text-white">
                    <th className="px-2 py-1.5 text-left font-semibold border border-[#003a5c] w-8">
                      NO
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold border border-[#003a5c] min-w-[100px]">
                      EBR
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold border border-[#003a5c] min-w-[120px]">
                      PE-Transit
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold border border-[#003a5c] min-w-[280px]">
                      Path
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold border border-[#003a5c] w-10">
                      BDS
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold border border-[#003a5c] w-10">
                      BTC
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold border border-[#003a5c] w-10">
                      JT2
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold border border-[#003a5c] w-10">
                      PNK
                    </th>
                    <th className="px-2 py-1.5 text-center font-semibold border border-[#003a5c] w-14">
                      Grand Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {routingTableData.slice(11).map((row, idx) => (
                    <tr
                      key={row.key}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-2 py-1 border border-gray-200 align-top text-xs">
                        {row.no}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 align-top font-medium text-xs">
                        {row.ebr}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 align-top text-xs">
                        {row.peTransit}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 align-top">
                        {row.paths.map((path, i) => (
                          <div
                            key={i}
                            className="py-0.5 text-[#00838f] cursor-pointer hover:text-[#005a7f] hover:underline text-xs leading-tight"
                            onClick={() => {
                              setSelectedBundleKey(row.key);
                              setBundleModalOpen(true);
                            }}
                          >
                            {path}{" "}
                            {i === 0 && (
                              <InfoCircleOutlined className="text-[10px]" />
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 text-center align-top text-sm font-bold text-gray-700">
                        {row.bds || ""}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 text-center align-top text-sm font-bold text-gray-700">
                        {row.btc || ""}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 text-center align-top text-sm font-bold text-gray-700">
                        {row.jt2 || ""}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 text-center align-top text-sm font-bold text-gray-700">
                        {row.pnk || ""}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 text-center align-top text-sm font-bold text-[#00838f]">
                        {row.grandTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

// Routing On Demand Tab Content
export function RoutingOnDemandContent() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("SUMBAGUT");
  const [selectedEBR, setSelectedEBR] = useState<string[]>([
    ebrOptionsByRegion["SUMBAGUT"]?.[0]?.value || "",
  ]);
  const [selectedGateway, setSelectedGateway] = useState("BDS");
  const [filterDate, setFilterDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [routingData, setRoutingData] = useState<GroupedRouteEntry[]>([]);

  const fetchRoutingData = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("region", selectedRegion);
      selectedEBR.forEach((ebr) => params.append("ebr[]", ebr));
      params.append("gateway", selectedGateway);
      params.append("date", filterDate.format("YYYY-MM-DD"));

      const response = await axios.get<FilterRouteResponse>(
        `/api/mbb-routing-mgt/filterRoute?${params.toString()}`,
        { timeout: config.api.timeout }
      );

      if (response.data.status) {
        const apiData = response.data.data;

        // Transform: group uplink and downlink by EBR name
        const ebrMap = new Map<string, GroupedRouteEntry>();

        // Process uplinks
        apiData.uplink.forEach((uplink) => {
          const existing = ebrMap.get(uplink.ebr) || { uplink: null, downlink: null, information: null };
          existing.uplink = uplink;
          existing.information = uplink.information || null;
          ebrMap.set(uplink.ebr, existing);
        });

        // Process downlinks
        apiData.downlink.forEach((downlink) => {
          const existing = ebrMap.get(downlink.ebr) || { uplink: null, downlink: null, information: null };
          existing.downlink = downlink;
          ebrMap.set(downlink.ebr, existing);
        });

        setRoutingData(Array.from(ebrMap.values()));
      }
    } catch (error) {
      console.error("Error fetching routing data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedRegion, selectedEBR, selectedGateway, filterDate]);

  useEffect(() => {
    fetchRoutingData();
  }, []);

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
            placeholder="Select Region"
            value={selectedRegion}
            onChange={(value) => {
              setSelectedRegion(value);
              setSelectedEBR([ebrOptionsByRegion[value]?.[0]?.value || ""]);
            }}
            options={regionOptions}
            style={{ width: "100%" }}
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
            options={ebrOptionsByRegion[selectedRegion] || []}
            style={{ width: "100%" }}
            maxTagCount="responsive"
            className="custom-select"
            classNames={{ popup: { root: "custom-select-dropdown" } }}
          />
        </div>
        <div className="col-span-3">
          <label className="text-xs text-gray-500 block mb-1">Gateway</label>
          <Select
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
          <DatePicker
            value={filterDate}
            onChange={(date) => date && setFilterDate(date)}
            format="D-MM-YYYY"
            allowClear={false}
            style={{ width: "100%" }}
            className="custom-select"
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
          loading={loading}
          onClick={fetchRoutingData}
        >
          CHECK ROUTING
        </Button>
      </div>
      {/* Show empty state when no data */}
      {routingData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg font-semibold">
              Data information not found
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Please select different filter options and try again
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 py-2 space-y-6 overflow-auto max-h-[calc(100vh-230px)]">
          {routingData.map((entry, entryIndex) => (
            <div key={entryIndex} className="space-y-4">
              {/* Information Header */}
              {entry.information && (
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#7f7f7f] font-bold">
                      Latency EBR to IGW :
                    </span>
                    <span className="text-white px-2 py-0.5 rounded inline-block bg-gradient-to-r from-[#009688] to-[#1ecb6b]">
                      {entry.information.latency_ebr_gw} ms
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#7f7f7f] font-bold">Status :</span>
                    <span className="text-yellow-600 font-bold font-italic">
                      {entry.information.status_symmetric}
                    </span>
                    <img src={warning} alt="Warning" className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Uplink Card */}
              {entry.uplink && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="relative flex items-center mb-6">
                    <div className="flex-1 h-[2px] bg-[#00838f]" />
                    <div className="absolute left-1/2 -translate-x-1/2 bg-white px-2">
                      <span className="border border-gray-300 px-4 py-1 rounded-full text-sm font-medium text-gray-600">
                        Uplink - {entry.uplink.ebr}
                      </span>
                    </div>
                    <div className="text-[#00838f] text-xl">→</div>
                  </div>
                  <div className="flex items-start justify-between px-4">
                    {mapRoutingData(entry.uplink.paths).map((item, index) => {
                      if (item.source === "line") {
                        return (
                          <div
                            key={index}
                            className="flex-1 flex items-center justify-center relative mt-6"
                          >
                            <div className="h-[2px] bg-[#00838f] flex-1" />
                            <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                              {item.value}
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <NetworkNodeLarge
                            key={index}
                            label={item.value}
                            type={item.source}
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              )}

              {/* Downlink Card */}
              {entry.downlink && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="relative flex items-center mb-6">
                    <div className="text-[#00838f] text-xl">←</div>
                    <div className="flex-1 h-[2px] bg-[#00838f]" />
                    <div className="absolute left-1/2 -translate-x-1/2 bg-white px-2">
                      <span className="border border-gray-300 px-4 py-1 rounded-full text-sm font-medium text-gray-600">
                        Downlink - {entry.downlink.ebr}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between px-4">
                    {mapRoutingData(entry.downlink.paths).map((item, index) => {
                      if (item.source === "line") {
                        return (
                          <div
                            key={index}
                            className="flex-1 flex items-center justify-center relative mt-6"
                          >
                            <div className="h-[2px] bg-[#00838f] flex-1" />
                            <span className="absolute bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-3 py-0.5 rounded text-xs">
                              {item.value}
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <NetworkNodeLarge
                            key={index}
                            label={item.value}
                            type={item.source}
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Slide Toggle Button */}
      <div className="flex justify-center w-full absolute bottom-0">
        <button
          onClick={() => setSlideIndex(1)}
          className="text-gray-400 hover:text-gray-600 transition-colors bg-white px-10 rounded-t"
        >
          <DownOutlined />
        </button>
      </div>
    </>
  );
}
