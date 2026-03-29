import { useState, useEffect } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useSupabaseInventory } from "@/hooks/use-supabase-inventory";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  HardDrive, 
  Users, 
  Wrench, 
  Key, 
  FileText, 
  Printer, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Shield
} from 'lucide-react';