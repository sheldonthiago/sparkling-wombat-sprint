import { ExportManager } from "@/components/inventory/ExportManager";

// ... existing imports remain unchanged

export default function InventoryPage() {
  // ... existing hook usage and state declarations remain unchanged  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar, Header, and Main Content remain unchanged */}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-auto">
        {/* NotificationSystem remains */}

        {/* Dashboard Section remains */}

        {/* Assets Section */}
        {activeSection === 'assets' && (
          <div className="space-y-6">
            {/* ... existing assets UI ... */}
          </div>
        )}

        {/* Users Section */}
        {activeSection === 'users' && (
          <div className="space-y-6">
            {/* ... existing users UI ... */}
          </div>
        )}

        {/* Maintenance Section */}
        {activeSection === 'maintenance' && (
          <div className="space-y-6">
            {/* ... existing maintenance UI ... */}
          </div>
        )}

        {/* Movements Section */}
        {activeSection === 'movements' && (
          <div className="space-y-6">
            {/* ... existing movements UI ... */}
          </div>
        )}

        {/* Licenses Section */}
        {activeSection === 'licenses' && (
          <div className="space-y-6">
            {/* ... existing licenses UI ... */}
          </div>
        )}

        {/* Supplies Section */}
        {activeSection === 'supplies' && (
          <div className="space-y-6">
            {/* ... existing supplies UI ... */}
          </div>
        )}

        {/* EXPORT BUTTONS - Added here, below the main content but above any dialogs */}
        <ExportManager
          items={items}
          movements={movements}
          supplies={printerSupplies}
          maintenances={maintenances}
        />
      </main>

      {/* Dialogs remain unchanged */}
    </div>
  );
}