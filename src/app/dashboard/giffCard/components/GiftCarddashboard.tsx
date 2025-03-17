"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Search, MoreHorizontal } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for the chart
const generateChartData = (period: string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Generate different data based on the selected period
    if (period === "today") {
        return months.map((month) => ({
            name: month,
            Sales: Math.floor(Math.random() * 200000) + 200000,
            Purchase: Math.floor(Math.random() * 150000) + 150000,
        }))
    } else if (period === "week") {
        return months.map((month) => ({
            name: month,
            Sales: Math.floor(Math.random() * 250000) + 150000,
            Purchase: Math.floor(Math.random() * 200000) + 100000,
        }))
    } else {
        return months.map((month) => ({
            name: month,
            Sales: Math.floor(Math.random() * 300000) + 100000,
            Purchase: Math.floor(Math.random() * 250000) + 50000,
        }))
    }
}

// Sample data for gift cards
const giftCards = [
    {
        id: "1",
        type: "Amazon",
        logo: "amazon",
        disabled: false,
        buyRate: "₦850",
    },
    {
        id: "2",
        type: "Steam",
        logo: "steam",
        disabled: false,
        buyRate: "₦850",
    },
    {
        id: "3",
        type: "Amazon",
        logo: "amazon",
        disabled: false,
        buyRate: "₦850",
    },
]

// Custom shape for the bar chart with rounded tops
const RoundedBar = (props: any) => {
    const { x, y, width, height, fill } = props
    const radius = 4

    return (
        <g>
            <rect x={x} y={y} width={width} height={height} fill={fill} rx={radius} ry={radius} />
        </g>
    )
}

const GiftCardDashboard = () => {
    const [dateFilter, setDateFilter] = useState<string>("today")
    const [chartData, setChartData] = useState(generateChartData("today"))
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [cards, setCards] = useState(giftCards)

    useEffect(() => {
        setChartData(generateChartData(dateFilter))
    }, [dateFilter])

    const handleToggleDisable = (id: string) => {
        setCards(cards.map((card) => (card.id === id ? { ...card, disabled: !card.disabled } : card)))
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const filteredCards = cards.filter((card) => card.type.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="w-full space-y-6">
            {/* Filter by Date */}
            <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px]">
                <h1 className="text-text-title text-xl font-semibold font-poppins">Filter by Date</h1>
                <div className="flex flex-row bg-background-alt gap-x-1.5 px-3 py-2 rounded-[8px]">
                    <button
                        className={`justify-center items-center ${dateFilter === "today" ? "bg-primary" : "bg-background"} text-text-body font-poppins px-4 py-3 w-[186px] rounded-[8px] active:bg-primary-foreground`}
                        onClick={() => setDateFilter("today")}
                    >
                        Today
                    </button>
                    <button
                        className={`justify-center items-center ${dateFilter === "week" ? "bg-primary" : "bg-background"} text-text-body font-poppins px-4 py-3 w-[186px] rounded-[8px]`}
                        onClick={() => setDateFilter("week")}
                    >
                        This Week
                    </button>
                    <button
                        className={`justify-center items-center ${dateFilter === "year" ? "bg-primary" : "bg-background"} text-text-body font-poppins px-4 py-3 w-[186px] rounded-[8px]`}
                        onClick={() => setDateFilter("year")}
                    >
                        This Year
                    </button>
                </div>
            </div>

            {/* Gift Card Metrics */}
            <div className="bg-background rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-text-title text-xl font-semibold font-poppins">Gift Card Metrics</h2>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#556B2F]"></div>
                            <span className="text-text-body font-poppins">Sales</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#CCFF00]"></div>
                            <span className="text-text-body font-poppins">Purchase</span>
                        </div>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            barGap={2}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis
                                tickFormatter={(value) => {
                                    if (value === 0) return "0"
                                    if (value === 100000) return "100K"
                                    if (value === 200000) return "200K"
                                    if (value === 300000) return "300K"
                                    if (value === 400000) return "400K"
                                    if (value === 500000) return "500K"
                                    return ""
                                }}
                            />
                            <Tooltip formatter={(value) => `${value}`} />
                            {/* <Legend display={false} /> */}
                            <Bar dataKey="Sales" fill="#556B2F" barSize={15} shape={<RoundedBar />} />
                            <Bar dataKey="Purchase" fill="#CCFF00" barSize={15} shape={<RoundedBar />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Available Gift Cards */}
            <div className="bg-background rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-text-title text-xl font-semibold font-poppins">Available Gift Cards</h2>
                    <div className="flex flex-row justify-center items-center">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-background-alt border-border rounded-l-[8px] p-4"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="bg-primary rounded-r-[8px] p-4 px-6">
                            <Search size={20} className="text-text-body" />
                        </button>
                    </div>
                </div>
                <div className="overflow-auto">
                    <Table className="w-full rounded-2xl bg-background">
                        <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5">
                            <TableRow>
                                <TableHead className="text-base font-poppins text-text-title">Card Type</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Disable</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Buy Rate</TableHead>
                                <TableHead className="text-base font-poppins text-text-title text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCards.map((card) => (
                                <TableRow key={card.id} className="py-6">
                                    <TableCell className="text-text-body font-poppins text-base py-6 flex items-center gap-2">
                                        {card.logo === "amazon" ? (
                                            <div className="w-8 h-8 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path d="M18.42 14.29c-.22-.12-.43-.03-.33.24.35.92.7 2.64.15 3.38-.55.74-2.55 1.09-4.33.13 0 0-.61-.53-1.4.37-.07.07-.04.2.08.28 1.17.81 2.92 1.3 4.62.91 1.7-.39 2.94-2.2 1.77-4.89-.05-.12-.34-.32-.56-.42zm.63-3.02c-.46-.58-1.08-1.09-1.82-1.43-.44-.2-.88-.36-1.33-.44-.45-.08-.9-.1-1.36-.05-.45.05-.91.16-1.35.33-.44.17-.86.4-1.25.69-.4.29-.76.63-1.09 1.02-.32.39-.6.82-.82 1.27-.22.46-.38.93-.47 1.42h.01c-.1.49-.13.99-.09 1.49.04.5.15 1 .32 1.47.17.47.39.92.67 1.33.28.41.6.79.97 1.12.37.33.77.62 1.21.85.43.23.89.41 1.38.52.48.11.98.16 1.48.14.5-.02 1-.11 1.49-.26.48-.15.95-.36 1.38-.63.43-.27.83-.59 1.18-.96.35-.37.66-.78.91-1.23.25-.45.45-.93.58-1.42.13-.5.2-1.01.19-1.52 0-.51-.08-1.02-.23-1.52-.14-.49-.35-.97-.61-1.42-.26-.44-.57-.86-.93-1.23-.36-.37-.76-.7-1.2-.97-.44-.27-.91-.49-1.4-.64-.49-.15-1-.24-1.51-.26-.51-.02-1.03.02-1.53.13-.5.11-.99.28-1.45.51-.46.23-.89.51-1.29.85-.39.34-.75.72-1.05 1.14-.31.42-.57.87-.77 1.35-.2.48-.34.98-.42 1.5-.08.51-.09 1.03-.04 1.55.05.52.17 1.03.35 1.52.18.49.42.96.71 1.39.29.43.63.82 1.02 1.16.39.34.81.64 1.28.87.46.23.95.41 1.46.52.5.11 1.02.16 1.54.14.51-.02 1.02-.1 1.52-.25.49-.15.97-.36 1.41-.62.44-.26.85-.58 1.22-.94.37-.36.7-.76.98-1.2.28-.44.51-.91.68-1.4.17-.49.28-.99.33-1.51.05-.52.04-1.04-.04-1.55-.08-.51-.22-1.01-.42-1.49h.01c-.2-.48-.46-.93-.77-1.35-.31-.42-.67-.8-1.05-1.14-.39-.34-.82-.62-1.29-.85-.46-.23-.95-.4-1.45-.51-.5-.11-1.02-.15-1.53-.13-.51.02-1.02.11-1.51.26-.49.15-.96.37-1.4.64-.44.27-.84.6-1.2.97-.36.37-.67.79-.93 1.23-.26.45-.47.93-.61 1.42-.15.5-.23 1.01-.23 1.52 0 .51.07 1.02.19 1.52.13.49.33.97.58 1.42.25.45.56.86.91 1.23.35.37.75.69 1.18.96.43.27.9.48 1.38.63.49.15.99.24 1.49.26.5.02 1-.03 1.48-.14.49-.11.95-.29 1.38-.52.44-.23.84-.52 1.21-.85.37-.33.69-.71.97-1.12.28-.41.5-.86.67-1.33.17-.47.28-.97.32-1.47.04-.5.01-1-.09-1.49h.01c-.09-.49-.25-.96-.47-1.42-.22-.45-.5-.88-.82-1.27-.33-.39-.69-.73-1.09-1.02-.39-.29-.81-.52-1.25-.69-.44-.17-.9-.28-1.35-.33-.46-.05-.91-.03-1.36.05-.45.08-.89.24-1.33.44-.74.34-1.36.85-1.82 1.43-.46.58-.76 1.24-.9 1.93-.14.69-.12 1.42.05 2.12.17.7.5 1.38.97 1.97.47.59 1.08 1.1 1.82 1.44.74.34 1.56.52 2.39.52.83 0 1.65-.18 2.39-.52.74-.34 1.35-.85 1.82-1.44.47-.59.8-1.27.97-1.97.17-.7.19-1.43.05-2.12-.14-.69-.44-1.35-.9-1.93z" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                                </svg>
                                            </div>
                                        )}
                                        {card.type}
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">
                                        <Switch checked={card.disabled} onCheckedChange={() => handleToggleDisable(card.id)} />
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{card.buyRate}</TableCell>
                                    <TableCell className="py-6 text-right">
                                        <button className="border border-primary-300 rounded-sm p-1 inline-flex items-center justify-center">
                                            <MoreHorizontal size={14} className="text-primary-300" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default GiftCardDashboard

