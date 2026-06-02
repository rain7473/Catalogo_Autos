"use client"

import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import {
  BarChart3,
  Car,
  CheckCircle2,
  DollarSign,
  Edit3,
  Eye,
  Fuel,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { Vehiculo } from "@/vehiculos"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type VehicleForm = Omit<Vehiculo, "id">

const emptyForm: VehicleForm = {
  nombre: "",
  marca: "",
  anio: new Date().getFullYear(),
  km: 0,
  transmision: "Automática",
  combustible: "Gasolina",
  precio: 0,
  estado: "disponible",
  imagen: "",
}

const storageKey = "autos-la-fe-admin-vehicles"
const statusColors = ["#16a34a", "#64748b"]
const brandColors = ["#b91c1c", "#0f766e", "#2563eb", "#7c3aed", "#ca8a04", "#0f172a"]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value)

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
}

function fallbackImage(form: VehicleForm) {
  const label = encodeURIComponent(`${form.nombre || "Vehículo"} ${form.anio}`)
  return `https://placehold.co/640x420/1e293b/f8fafc?text=${label}`
}

function groupByText<T extends string | number>(
  vehicles: Vehiculo[],
  getKey: (vehicle: Vehiculo) => T
) {
  const grouped = new Map<T, number>()
  vehicles.forEach((vehicle) => {
    const key = getKey(vehicle)
    grouped.set(key, (grouped.get(key) ?? 0) + 1)
  })

  return [...grouped.entries()].map(([name, value]) => ({
    name: String(name),
    value,
  }))
}

function groupValueByBrand(vehicles: Vehiculo[]) {
  const grouped = new Map<string, number>()
  vehicles.forEach((vehicle) => {
    grouped.set(vehicle.marca, (grouped.get(vehicle.marca) ?? 0) + vehicle.precio)
  })

  return [...grouped.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
}

interface AdminDashboardProps {
  initialVehicles: Vehiculo[]
}

export default function AdminDashboard({ initialVehicles }: AdminDashboardProps) {
  const [vehicles, setVehicles] = useState<Vehiculo[]>(initialVehicles)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"todos" | Vehiculo["estado"]>("todos")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<VehicleForm>(emptyForm)

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)
    if (saved) {
      setVehicles(JSON.parse(saved) as Vehiculo[])
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(vehicles))
  }, [vehicles])

  const filteredVehicles = useMemo(() => {
    const term = normalize(query)

    return vehicles.filter((vehicle) => {
      const haystack = normalize(
        [
          vehicle.nombre,
          vehicle.marca,
          vehicle.anio,
          vehicle.transmision,
          vehicle.combustible,
        ].join(" ")
      )

      return (
        (status === "todos" || vehicle.estado === status) &&
        (!term || haystack.includes(term))
      )
    })
  }, [query, status, vehicles])

  const stats = useMemo(() => {
    const disponibles = vehicles.filter((vehicle) => vehicle.estado === "disponible")
    const vendidos = vehicles.filter((vehicle) => vehicle.estado === "vendido")
    const valorInventario = disponibles.reduce((sum, vehicle) => sum + vehicle.precio, 0)

    return {
      total: vehicles.length,
      disponibles: disponibles.length,
      vendidos: vendidos.length,
      valorInventario,
    }
  }, [vehicles])

  const chartData = useMemo(() => {
    const byStatus = [
      { name: "Disponibles", value: stats.disponibles },
      { name: "Vendidos", value: stats.vendidos },
    ]

    return {
      byStatus,
      valueByBrand: groupValueByBrand(vehicles),
      byFuel: groupByText(vehicles, (vehicle) => vehicle.combustible),
      byYear: groupByText(vehicles, (vehicle) => vehicle.anio).sort(
        (a, b) => Number(a.name) - Number(b.name)
      ),
    }
  }, [stats.disponibles, stats.vendidos, vehicles])

  function openCreateForm() {
    setEditingId(null)
    setForm(emptyForm)
    setIsFormOpen(true)
  }

  function openEditForm(vehicle: Vehiculo) {
    const { id: _id, ...vehicleForm } = vehicle
    setEditingId(vehicle.id)
    setForm(vehicleForm)
    setIsFormOpen(true)
  }

  function updateField<K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function saveVehicle() {
    if (!form.nombre.trim() || !form.marca.trim()) return

    const cleanForm = {
      ...form,
      nombre: form.nombre.trim(),
      marca: form.marca.trim(),
      imagen: form.imagen.trim() || fallbackImage(form),
      precio: Number(form.precio) || 0,
      km: Number(form.km) || 0,
      anio: Number(form.anio) || new Date().getFullYear(),
    }

    if (editingId) {
      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle.id === editingId ? { id: editingId, ...cleanForm } : vehicle
        )
      )
    } else {
      setVehicles((current) => [{ id: Date.now(), ...cleanForm }, ...current])
    }

    setIsFormOpen(false)
  }

  function toggleSold(vehicle: Vehiculo) {
    setVehicles((current) =>
      current.map((item) =>
        item.id === vehicle.id
          ? {
              ...item,
              estado: item.estado === "vendido" ? "disponible" : "vendido",
            }
          : item
      )
    )
  }

  function deleteVehicle(vehicleId: number) {
    setVehicles((current) => current.filter((vehicle) => vehicle.id !== vehicleId))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-red-300">
              Panel administrativo
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Inventario Autos La Fe
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="h-10 rounded-xl bg-white text-slate-950 hover:bg-slate-100"
              onClick={() => window.open("/", "_blank")}
              type="button"
            >
              <Eye />
              Ver catálogo
            </Button>
            <Button
              className="h-10 rounded-xl bg-red-700 text-white hover:bg-red-800"
              onClick={openCreateForm}
              type="button"
            >
              <Plus />
              Nuevo vehículo
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<Car />} label="Total" value={stats.total.toString()} />
          <MetricCard icon={<CheckCircle2 />} label="Disponibles" value={stats.disponibles.toString()} />
          <MetricCard icon={<DollarSign />} label="Valor disponible" value={formatCurrency(stats.valorInventario)} />
          <MetricCard icon={<Trash2 />} label="Vendidos" value={stats.vendidos.toString()} />
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.35fr]">
          <ChartCard
            description="Relación entre unidades activas y cerradas."
            icon={<BarChart3 />}
            title="Estado del inventario"
          >
            <ResponsiveContainer height={250} width="100%">
              <PieChart>
                <Pie
                  data={chartData.byStatus}
                  dataKey="value"
                  innerRadius={64}
                  outerRadius={92}
                  paddingAngle={4}
                >
                  {chartData.byStatus.map((entry, index) => (
                    <Cell fill={statusColors[index % statusColors.length]} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} vehículos`, "Total"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 px-4 pb-4">
              {chartData.byStatus.map((item, index) => (
                <div className="rounded-xl bg-slate-50 p-3" key={item.name}>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: statusColors[index] }}
                    />
                    {item.name}
                  </div>
                  <p className="mt-1 text-2xl font-extrabold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            description="Suma del precio de venta por marca."
            icon={<DollarSign />}
            title="Valor por marca"
          >
            <ResponsiveContainer height={310} width="100%">
              <BarChart data={chartData.valueByBrand} margin={{ left: 8, right: 16, top: 12 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} />
                <YAxis
                  fontSize={12}
                  tickFormatter={(value) => `$${Number(value) / 1000}k`}
                  tickLine={false}
                  width={54}
                />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Valor"]} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.valueByBrand.map((entry, index) => (
                    <Cell fill={brandColors[index % brandColors.length]} key={entry.name} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <ChartCard
            description="Combustible más común en el catálogo."
            icon={<Fuel />}
            title="Inventario por combustible"
          >
            <ResponsiveContainer height={240} width="100%">
              <BarChart data={chartData.byFuel} layout="vertical" margin={{ left: 24, right: 16 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={false} />
                <XAxis allowDecimals={false} type="number" />
                <YAxis dataKey="name" fontSize={12} tickLine={false} type="category" width={78} />
                <Tooltip formatter={(value) => [`${value} vehículos`, "Total"]} />
                <Bar dataKey="value" fill="#0f766e" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            description="Cantidad de unidades por año."
            icon={<Car />}
            title="Modelos por año"
          >
            <ResponsiveContainer height={240} width="100%">
              <BarChart data={chartData.byYear} margin={{ left: 0, right: 16, top: 12 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} />
                <YAxis allowDecimals={false} fontSize={12} tickLine={false} width={32} />
                <Tooltip formatter={(value) => [`${value} vehículos`, "Total"]} />
                <Bar dataKey="value" fill="#b91c1c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <Card className="mt-6 border-white/10 bg-white text-slate-950 shadow-2xl">
          <CardHeader className="gap-4 border-b border-slate-100 sm:grid-cols-[1fr_auto]">
            <div>
              <CardTitle className="text-xl font-extrabold">Vehículos</CardTitle>
              <CardDescription>
                Gestiona publicaciones, precios y disponibilidad del catálogo.
              </CardDescription>
            </div>
            <div className="grid gap-2 sm:grid-cols-[260px_220px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="h-10 rounded-xl border-slate-200 bg-white pl-9"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar vehículo"
                  value={query}
                />
              </label>
              <select
                className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-700 focus:ring-4 focus:ring-red-100"
                onChange={(event) => setStatus(event.target.value as typeof status)}
                value={status}
              >
                <option value="todos">Todos los estados</option>
                <option value="disponible">Disponibles</option>
                <option value="vendido">Vendidos</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="px-4">Vehículo</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Detalles</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="px-4 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow className="border-slate-100" key={vehicle.id}>
                    <TableCell className="px-4">
                      <div className="flex min-w-[220px] items-center gap-3">
                        <img
                          alt={`${vehicle.nombre} ${vehicle.anio}`}
                          className="h-14 w-20 rounded-lg object-cover ring-1 ring-slate-200"
                          src={vehicle.imagen}
                        />
                        <div>
                          <p className="text-xs font-extrabold uppercase tracking-wide text-red-700">
                            {vehicle.marca}
                          </p>
                          <p className="font-extrabold text-slate-950">{vehicle.nombre}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{vehicle.anio}</TableCell>
                    <TableCell>
                      <div className="min-w-[170px] text-sm text-slate-500">
                        <p>{formatNumber(vehicle.km)} km</p>
                        <p>{vehicle.transmision} · {vehicle.combustible}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-extrabold text-slate-950">
                      {formatCurrency(vehicle.precio)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          vehicle.estado === "disponible"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-700"
                        }
                      >
                        {vehicle.estado === "disponible" ? "Disponible" : "Vendido"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="rounded-lg"
                          onClick={() => toggleSold(vehicle)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          {vehicle.estado === "vendido" ? "Publicar" : "Vender"}
                        </Button>
                        <Button
                          className="rounded-lg"
                          onClick={() => openEditForm(vehicle)}
                          size="icon-sm"
                          type="button"
                          variant="outline"
                        >
                          <Edit3 />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          className="rounded-lg text-red-700 hover:bg-red-50"
                          onClick={() => deleteVehicle(vehicle.id)}
                          size="icon-sm"
                          type="button"
                          variant="outline"
                        >
                          <Trash2 />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredVehicles.length === 0 && (
              <div className="px-4 py-16 text-center">
                <p className="text-lg font-extrabold text-slate-900">Sin resultados</p>
                <p className="mt-1 text-sm text-slate-500">
                  Cambia la búsqueda o limpia el filtro de estado.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="ml-auto flex h-full w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white text-slate-950 shadow-2xl">
            <div className="border-b border-slate-100 p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-red-700">
                {editingId ? "Editar publicación" : "Nuevo vehículo"}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {editingId ? form.nombre : "Agregar al inventario"}
              </h2>
            </div>

            <div className="grid flex-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
              <Field label="Marca">
                <Input
                  className="h-10 rounded-xl border-slate-200"
                  onChange={(event) => updateField("marca", event.target.value)}
                  value={form.marca}
                />
              </Field>
              <Field label="Modelo">
                <Input
                  className="h-10 rounded-xl border-slate-200"
                  onChange={(event) => updateField("nombre", event.target.value)}
                  value={form.nombre}
                />
              </Field>
              <Field label="Año">
                <Input
                  className="h-10 rounded-xl border-slate-200"
                  min="1980"
                  onChange={(event) => updateField("anio", Number(event.target.value))}
                  type="number"
                  value={form.anio}
                />
              </Field>
              <Field label="Kilometraje">
                <Input
                  className="h-10 rounded-xl border-slate-200"
                  min="0"
                  onChange={(event) => updateField("km", Number(event.target.value))}
                  type="number"
                  value={form.km}
                />
              </Field>
              <Field label="Precio">
                <Input
                  className="h-10 rounded-xl border-slate-200"
                  min="0"
                  onChange={(event) => updateField("precio", Number(event.target.value))}
                  type="number"
                  value={form.precio}
                />
              </Field>
              <Field label="Estado">
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-red-700 focus:ring-4 focus:ring-red-100"
                  onChange={(event) => updateField("estado", event.target.value as Vehiculo["estado"])}
                  value={form.estado}
                >
                  <option value="disponible">Disponible</option>
                  <option value="vendido">Vendido</option>
                </select>
              </Field>
              <Field label="Transmisión">
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-red-700 focus:ring-4 focus:ring-red-100"
                  onChange={(event) => updateField("transmision", event.target.value)}
                  value={form.transmision}
                >
                  <option>Automática</option>
                  <option>Manual</option>
                </select>
              </Field>
              <Field label="Combustible">
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-red-700 focus:ring-4 focus:ring-red-100"
                  onChange={(event) => updateField("combustible", event.target.value)}
                  value={form.combustible}
                >
                  <option>Gasolina</option>
                  <option>Diesel</option>
                  <option>Híbrido</option>
                  <option>Eléctrico</option>
                </select>
              </Field>
              <Field className="sm:col-span-2" label="URL de imagen">
                <Input
                  className="h-10 rounded-xl border-slate-200"
                  onChange={(event) => updateField("imagen", event.target.value)}
                  placeholder="https://..."
                  value={form.imagen}
                />
              </Field>
            </div>

            <div className="grid gap-2 border-t border-slate-100 p-5 sm:grid-cols-2">
              <Button
                className="h-10 rounded-xl border-slate-200"
                onClick={() => setIsFormOpen(false)}
                type="button"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                className="h-10 rounded-xl bg-red-700 text-white hover:bg-red-800"
                disabled={!form.nombre.trim() || !form.marca.trim()}
                onClick={saveVehicle}
                type="button"
              >
                Guardar vehículo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <Card className="border-white/10 bg-white/10 text-white ring-white/10">
      <CardContent className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/20 text-red-200 [&_svg]:size-5">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-300">{label}</p>
          <p className="mt-1 text-2xl font-extrabold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ChartCard({
  children,
  description,
  icon,
  title,
}: {
  children: ReactNode
  description: string
  icon: ReactNode
  title: string
}) {
  return (
    <Card className="border-white/10 bg-white text-slate-950 shadow-xl">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-700 [&_svg]:size-5">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg font-extrabold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}

function Field({
  children,
  className = "",
  label,
}: {
  children: ReactNode
  className?: string
  label: string
}) {
  return (
    <div className={className}>
      <Label className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-500">
        {label}
      </Label>
      {children}
    </div>
  )
}
