"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReportsPage as ReportsPageComponent } from '@/components/inventory/ReportsPage';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Users, Settings } from 'lucide-react';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <ReportsPageComponent />
  );
}