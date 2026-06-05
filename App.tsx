
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Routes, Route, useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StockMarket from './components/StockMarket';
import RealEstate from './components/RealEstate';
import ConstructionManagement from './components/ConstructionManagement';
import CompanyStakes from './components/CompanyStakes';
import AssetManagement from './components/AssetManagement';
import Alerts from './components/Alerts';
import SuperAgenda from './components/SuperAgenda';
import Deposits from './components/Deposits';
import Contracts from './components/Contracts';
import Reports from './components/Reports';
import Inbox from './components/Inbox';
import RecurringExpenses from './components/RecurringExpenses';
import DocumentManagement from './components/DocumentManagement';
import DocumentVault from './components/DocumentVault';
import PropertyVacancyMaintenanceMap from './components/PropertyVacancyMaintenanceMap';
import ExpenseImport from './components/ExpenseImport';
import BankLoansCompanies from './components/BankLoansCompanies';
import InsuranceClaimsList from './pages/InsuranceClaimsList';
import InsuranceClaimDetail from './pages/InsuranceClaimDetail';
import VehicleAccidentsList from './pages/VehicleAccidentsList';
import PropertyClaimsList from './pages/PropertyClaimsList';
import InventoryItemsList from './pages/InventoryItemsList';
import InventoryItemDetail from './pages/InventoryItemDetail';
import PropertyMaintenancesList from './pages/PropertyMaintenancesList';
import PropertyMaintenanceDetail from './pages/PropertyMaintenanceDetail';
import AppliancesList from './pages/AppliancesList';
import ApplianceDetail from './pages/ApplianceDetail';
import LitigationsList from './pages/LitigationsList';
import LitigationDetail from './pages/LitigationDetail';
import PropertyDetail from './pages/PropertyDetail';
import VehicleDetails from './pages/VehicleDetails';
import RentalContractDetail from './pages/RentalContractDetail';
import CommandPalette from './components/CommandPalette';
import DepositDetail from './pages/DepositDetail';
import OperationsList from './pages/OperationsList';
import OperationDetail from './pages/OperationDetail';
import ElevatorsList from './components/ElevatorsList';
import Condominiums from './components/Condominiums';
import TableManagement from './components/TableManagement';
import CompanyDigitalWallet from './components/CompanyDigitalWallet';
import SystemStatus from './components/SystemStatus';
import SystemAlertsRules from './components/SystemAlertsRules';
import SystemImportWizard from './components/SystemImportWizard';
import SystemBackupsExports from './components/SystemBackupsExports';
import SystemContractTemplates from './components/SystemContractTemplates';
import MaintenanceCompaniesList from './components/MaintenanceCompaniesList';
import ContactsList from './components/ContactsList';
import PortalFinancasSync from './components/PortalFinancasSync';
import EntitySelector, { Entity } from './components/EntitySelector';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useEntity } from './contexts/EntityContext';
import { AssetCategory, Alert } from './types';
import { Bell, Search, Menu, Wrench, Home, Hammer, Paintbrush, Inbox as InboxIcon, CalendarDays, Sparkles, Building2, Plus, FileText } from 'lucide-react';
import { EmptyState, Button } from './components/ui';
import { apiService } from './services/api';
import AIAssistant from './components/AIAssistant';
import VehicleForm from './components/VehicleForm';
import PropertyForm from './components/PropertyForm';
import ContractForm from './components/ContractForm';
import AlertForm from './components/AlertForm';
import InvestmentForm, { InvestmentFormSuccessResult } from './components/InvestmentForm';
import InsuranceForm from './components/InsuranceForm';

type ActiveTab =
  | AssetCategory
  | 'DASHBOARD'
  | 'ALERTS'
  | 'SUPER_AGENDA'
  | 'OPERATIONS'
  | 'CONTRACTS'
  | 'REPORTS'
  | 'INBOX'
  | 'RECURRING_EXPENSES'
  | 'DOCUMENT_MANAGEMENT'
  | 'DOCUMENT_VAULT'
  | 'INSURANCE_CLAIMS'
  | 'VEHICLE_ACCIDENTS'
  | 'PROPERTY_CLAIMS'
  | 'INVENTORY_ITEMS'
  | 'PROPERTY_MAINTENANCES'
  | 'APPLIANCES'
  | 'LITIGATIONS'
  | 'ELEVATORS'
  | 'CONDOMINIUMS'
  | 'TABLE_MANAGEMENT'
  | 'PROPERTY_VACANCY_MAINTENANCE_MAP'
  | 'EXPENSE_IMPORT'
  | 'BANK_LOANS'
  | 'COMPANY_WALLET'
  | 'SYSTEM_STATUS'
  | 'ALERTS_RULES'
  | 'IMPORT_WIZARD'
  | 'BACKUPS_EXPORTS'
  | 'CONTRACT_TEMPLATES'
  | 'MAINTENANCE_COMPANIES'
  | 'CONTACTS'
  | 'PORTAL_FINANCAS_SYNC';

// Small icon button with optional badge, used in the header
const HeaderIconBtn: React.FC<{
  onClick: () => void;
  title: string;
  badge?: number;
  badgeColor?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, title, badge = 0, badgeColor = 'bg-neutral-500', className = '', children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`relative p-2 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors ${className}`}
  >
    {children}
    {badge > 0 && (
      <span className={`absolute -top-0.5 -right-0.5 h-4 w-4 ${badgeColor} text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white`}>
        {badge > 9 ? '9+' : badge}
      </span>
    )}
  </button>
);

const MainRouteContent: React.FC<{
  activeTab: ActiveTab;
  activeEntity: Entity | null;
  entities: Entity[];
  paletteSearch?: { type: string; term: string } | null;
  onPaletteSearchConsumed?: () => void;
  onCreateEntity?: () => void;
}> = ({ activeTab, activeEntity, entities, paletteSearch, onPaletteSearchConsumed, onCreateEntity }) => {
  if (!activeEntity) {
    if (entities.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/30 to-neutral-100 p-8">
          <div className="w-full max-w-md text-center">
            {/* Icon with glow */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute w-36 h-36 bg-brand-400/15 rounded-full blur-3xl" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl shadow-card-lg flex items-center justify-center shadow-brand-600/25 shadow-xl">
                <Building2 size={36} className="text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">
              Bem-vindo ao InvestMaster Pro
            </h1>
            <p className="text-neutral-500 mb-8 leading-relaxed max-w-sm mx-auto">
              Crie o seu primeiro portfólio para começar a gerir imóveis, contratos e alertas num único lugar.
            </p>

            <button
              onClick={onCreateEntity}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 hover:-translate-y-px active:translate-y-0"
            >
              <Plus size={16} />
              Criar primeiro portfólio
            </button>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3 mt-12 pt-8 border-t border-neutral-200/80">
              {[
                { icon: Building2, label: 'Gerir imóveis', desc: 'Propriedades, contratos e manutenções' },
                { icon: FileText, label: 'Controlar contratos', desc: 'Arrendamentos e prazos' },
                { icon: Bell, label: 'Acompanhar alertas', desc: 'Notificações e ações em tempo real' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/60 border border-neutral-200/60 shadow-card">
                  <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center border border-brand-100">
                    <Icon size={16} className="text-brand-600" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 leading-tight">{label}</p>
                  <p className="text-[10px] text-neutral-400 leading-tight text-center">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-neutral-100 p-8">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 border border-neutral-200 shadow-card">
            <Building2 size={24} className="text-neutral-400" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">Selecione um portfólio</h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Utilize o seletor no topo da página para escolher o portfólio que pretende visualizar.
          </p>
        </div>
      </div>
    );
  }

  switch (activeTab) {
    case 'INBOX':
      return <Inbox entityId={parseInt(activeEntity.id)} />;
    case 'DASHBOARD':
      return <Dashboard entity={activeEntity} />;
    case 'SUPER_AGENDA':
      return <SuperAgenda entityId={parseInt(activeEntity.id)} />;
    case 'OPERATIONS':
      return <OperationsList entityId={activeEntity.id} />;
    case AssetCategory.EQUITY:
      return <StockMarket
        entityId={activeEntity.id}
        initialSearch={paletteSearch?.type === 'investment' ? paletteSearch.term : undefined}
        onInitialSearchConsumed={onPaletteSearchConsumed}
      />;
    case AssetCategory.REAL_ESTATE:
      return <RealEstate entityId={activeEntity.id} />;
    case AssetCategory.CONSTRUCTION:
      return <ConstructionManagement entityId={activeEntity.id} />;
    case AssetCategory.BUSINESS_STAKE:
      return <CompanyStakes entityId={activeEntity.id} />;
    case AssetCategory.VEHICLE:
      return <AssetManagement entityId={activeEntity.id} />;
    case AssetCategory.DEPOSIT:
      return <Deposits entityId={activeEntity.id} />;
    case 'ALERTS':
      return <Alerts entityId={parseInt(activeEntity.id)} />;
    case 'CONTRACTS':
      return <Contracts
        entityId={activeEntity.id}
        initialSearch={paletteSearch?.type === 'contract' ? paletteSearch.term : undefined}
        onInitialSearchConsumed={onPaletteSearchConsumed}
      />;
    case 'REPORTS':
      return <Reports entityId={parseInt(activeEntity.id)} />;
    case 'RECURRING_EXPENSES':
      return <RecurringExpenses entityId={parseInt(activeEntity.id)} />;
    case 'DOCUMENT_MANAGEMENT':
      return <DocumentManagement entityId={parseInt(activeEntity.id)} />;
    case 'DOCUMENT_VAULT':
      return <DocumentVault
        entityId={activeEntity.id}
        initialTab="all"
        initialTypeFilter=""
        initialSearch={paletteSearch?.type === 'document' ? paletteSearch.term : undefined}
        onInitialSearchConsumed={onPaletteSearchConsumed}
      />;
    case 'INSURANCE_CLAIMS':
      return <InsuranceClaimsList entityId={activeEntity.id} />;
    case 'VEHICLE_ACCIDENTS':
      return <VehicleAccidentsList entityId={activeEntity.id} />;
    case 'PROPERTY_CLAIMS':
      return <PropertyClaimsList entityId={activeEntity.id} />;
    case 'INVENTORY_ITEMS':
      return <InventoryItemsList entityId={activeEntity.id} />;
    case 'PROPERTY_MAINTENANCES':
      return <PropertyMaintenancesList entityId={activeEntity.id} />;
    case 'PROPERTY_VACANCY_MAINTENANCE_MAP':
      return <PropertyVacancyMaintenanceMap entityId={parseInt(activeEntity.id)} initialViewMode={location.state?.viewMode} />;
    case 'EXPENSE_IMPORT':
      return <ExpenseImport />;
    case 'BANK_LOANS':
      return <BankLoansCompanies entityId={parseInt(activeEntity.id)} />;
    case 'APPLIANCES':
      return <AppliancesList entityId={activeEntity.id} />;
    case 'LITIGATIONS':
      return <LitigationsList entityId={activeEntity.id} />;
    case 'ELEVATORS':
      return <ElevatorsList entityId={activeEntity.id} />;
    case 'CONDOMINIUMS':
      return <Condominiums entityId={activeEntity.id} />;
    case 'TABLE_MANAGEMENT':
      return <TableManagement entityId={activeEntity.id} />;
    case 'COMPANY_WALLET':
      return <CompanyDigitalWallet entityId={parseInt(activeEntity.id)} />;
    case 'SYSTEM_STATUS':
      return <SystemStatus entityId={activeEntity.id} />;
    case 'ALERTS_RULES':
      return <SystemAlertsRules entityId={activeEntity.id} />;
    case 'IMPORT_WIZARD':
      return <SystemImportWizard entityId={activeEntity.id} />;
    case 'BACKUPS_EXPORTS':
      return <SystemBackupsExports entityId={activeEntity.id} />;
    case 'CONTRACT_TEMPLATES':
      return <SystemContractTemplates entityId={activeEntity.id} onClose={() => setActiveTab('DASHBOARD')} />;
    case 'MAINTENANCE_COMPANIES':
      return <MaintenanceCompaniesList entityId={activeEntity.id} />;
    case 'CONTACTS':
      return <ContactsList entityId={activeEntity.id} />;
    case 'PORTAL_FINANCAS_SYNC':
      return <PortalFinancasSync entityId={parseInt(activeEntity.id)} onClose={() => setActiveTab('DASHBOARD')} onSuccess={() => {}} />;
    default:
      return <Dashboard entity={activeEntity} />;
  }
};

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const { activeEntity, entities, isLoading: isLoadingEntities, error: entityError, setActiveEntity, refreshEntities } = useEntity();
  const location = useRouterLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('INBOX');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  // Controla abertura do EntityForm a partir do empty-state
  const [isEntityFormOpen, setIsEntityFormOpen] = useState(false);
  // Campos pré-preenchidos pelo assistente — abrir form diretamente no App
  const [aiFormPending, setAiFormPending] = useState<{
    intent: string; form: string; fields: Record<string, unknown>;
  } | null>(null);
  // Veículos carregados para o InsuranceForm (null = ainda não carregou, [] = carregado vazio)
  const [aiInsuranceVehicles, setAiInsuranceVehicles] = useState<any[] | null>(null);
  const [aiInsuranceVehiclesError, setAiInsuranceVehiclesError] = useState<string | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState<{ type: string; term: string } | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tasksTodayCount, setTasksTodayCount] = useState<number>(0);
  const [tasksOverdueCount, setTasksOverdueCount] = useState<number>(0);
  const [maintenanceCount, setMaintenanceCount] = useState<number>(0);
  const [vacantCount, setVacantCount] = useState<number>(0);
  const [vacantInMaintenanceCount, setVacantInMaintenanceCount] = useState<number>(0);
  const [constructionCount, setConstructionCount] = useState<number>(0);
  const backendError = entityError;
  
  // Ref para prevenir loop infinito entre URL e activeTab
  const isUpdatingFromCode = useRef(false);
  const lastPathRef = useRef<string>('');
  const lastTabRef = useRef<ActiveTab>('INBOX');

  // Carregar veículos quando o Assistente IA pede InsuranceForm
  useEffect(() => {
    if (aiFormPending?.form !== 'InsuranceForm' || !activeEntity) {
      setAiInsuranceVehicles(null);
      setAiInsuranceVehiclesError(null);
      return;
    }
    let cancelled = false;
    setAiInsuranceVehicles(null);
    setAiInsuranceVehiclesError(null);
    apiService.getVehicles(parseInt(activeEntity.id))
      .then((data: any[]) => {
        if (cancelled) return;
        setAiInsuranceVehicles(Array.isArray(data) ? data : []);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setAiInsuranceVehiclesError(err?.message || 'Erro ao carregar veículos.');
      });
    return () => { cancelled = true; };
  }, [aiFormPending, activeEntity]);

  // Atalho global Ctrl+K para abrir a Command Palette
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        // Não interceptar se o foco está dentro de um formulário (ex: campos de texto nos módulos)
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'TEXTAREA') return;
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsPaletteOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Handler para navegação da Command Palette com filtro inicial
  const handlePaletteNavigate = (type: string, term: string, entityId?: number) => {
    if (type === 'entity' && entityId != null) {
      const found = entities.find(e => parseInt(e.id) === entityId);
      if (found) setActiveEntity(found);
      return;
    }
    setPaletteSearch({ type, term });
  };

  // Carregar alertas quando entidade ativa mudar
  useEffect(() => {
    if (activeEntity) {
      // Carregar alertas
      apiService.getAlerts(parseInt(activeEntity.id), false)
        .then((data) => {
          if (data && Array.isArray(data)) {
            setAlerts(data);
          }
        })
        .catch((error) => {
          console.error('Erro ao carregar alertas:', error);
          setAlerts([]);
        });
    } else {
      setAlerts([]);
    }
  }, [activeEntity]);

  // Carregar contagens de Inbox/Tarefas (hoje + em atraso)
  useEffect(() => {
    if (!activeEntity) {
      setTasksTodayCount(0);
      setTasksOverdueCount(0);
      return;
    }
    let cancelled = false;

    const load = async () => {
      try {
        const entityId = parseInt(activeEntity.id);
        const [today, overdue] = await Promise.all([
          apiService.getTasks({ entity_id: entityId, status: 'open', range: 'today' }).catch(() => []),
          apiService.getTasks({ entity_id: entityId, status: 'open', range: 'overdue' }).catch(() => []),
        ]);
        if (cancelled) return;
        setTasksTodayCount(Array.isArray(today) ? today.length : 0);
        setTasksOverdueCount(Array.isArray(overdue) ? overdue.length : 0);
      } catch (e) {
        if (cancelled) return;
        setTasksTodayCount(0);
        setTasksOverdueCount(0);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [activeEntity]);

  const inboxBadgeCount = useMemo(() => tasksTodayCount + tasksOverdueCount, [tasksTodayCount, tasksOverdueCount]);

  const superAgendaBadgeCount = useMemo(() => {
    const todayYmd = new Date().toISOString().slice(0, 10);
    const alertDueToday = (alerts || []).filter((a: any) => {
      const d = a?.due_date ? String(a.due_date).slice(0, 10) : '';
      return d === todayYmd;
    }).length;
    const alertOverdue = (alerts || []).filter((a: any) => {
      const d = a?.due_date ? String(a.due_date).slice(0, 10) : '';
      return d && d < todayYmd;
    }).length;
    return tasksTodayCount + tasksOverdueCount + alertDueToday + alertOverdue;
  }, [alerts, tasksTodayCount, tasksOverdueCount]);

  // Carregar contagens de imóveis (em manutenção, vazios, vazios em manutenção, em obras)
  useEffect(() => {
    if (!activeEntity) {
      setMaintenanceCount(0);
      setVacantCount(0);
      setVacantInMaintenanceCount(0);
      setConstructionCount(0);
      return;
    }
    let cancelled = false;

    const load = async () => {
      try {
        const entityId = parseInt(activeEntity.id);
        const [props, maints, contracts] = await Promise.all([
          apiService.getPropertiesLite(entityId, false),
          apiService.getAllPropertyMaintenances({ entity_id: entityId }, false),
          apiService.getRentalContracts({ entity_id: entityId, is_active: true }).catch(() => []), // Buscar contratos ativos para verificar quais imóveis estão arrendados
        ]);

        if (cancelled) return;

        const properties = Array.isArray(props) ? (props as any[]) : [];
        const maintenances = Array.isArray(maints) ? (maints as any[]) : [];
        const rentalContracts = Array.isArray(contracts) ? (contracts as any[]) : [];

        const normalize = (v: unknown) => {
          if (typeof v === 'string') return v.trim().toLowerCase();
          if (v && typeof v === 'object' && 'value' in v) return String(v.value).trim().toLowerCase();
          return '';
        };
        const normalizeStatus = (p: any) => {
          const s = normalize(p?.status);
          return s;
        };
        
        // Identificar imóveis com contratos ativos (arrendados)
        const propertiesWithActiveContracts = new Set<number>();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (const contract of rentalContracts) {
          if (!contract?.property_id || !contract?.is_active) continue;
          
          // Verificar se o contrato está ativo hoje
          const startDate = contract.start_date ? new Date(contract.start_date) : null;
          const endDate = contract.end_date ? new Date(contract.end_date) : null;
          
          if (startDate && startDate > today) continue; // Contrato ainda não começou
          if (endDate && endDate < today && !contract.is_indefinite_term) continue; // Contrato já terminou
          
          // Verificar status do contrato
          const contractStatus = normalize(contract.contract_status);
          if (contractStatus === 'ativo' || contractStatus === 'denunciado' || contractStatus === 'em_litigio') {
            propertiesWithActiveContracts.add(Number(contract.property_id));
          }
        }
        
        const isVacant = (p: any) => {
          const s = normalizeStatus(p);
          return s === 'vacant' || s === 'vacant_soon';
        };
        
        const isMaintenance = (p: any) => {
          const s = normalizeStatus(p);
          return s === 'maintenance';
        };
        
        const isConstruction = (p: any) => {
          const s = normalizeStatus(p);
          return s === 'construction';
        };
        
        const isActiveMaintenance = (m: any) => {
          const s = normalize(m?.status);
          // Manutenções ativas: pendente ou em_progresso (conforme enum MaintenanceStatus)
          return s === 'pendente' || s === 'em_progresso';
        };

        // Identificar imóveis com manutenções ativas (registadas)
        const activeMaintenancePropertyIds = new Set<number>();
        for (const m of maintenances) {
          if (!m?.property_id) continue;
          if (!isActiveMaintenance(m)) continue;
          activeMaintenancePropertyIds.add(Number(m.property_id));
        }

        // Contar TODOS os imóveis em manutenção:
        // Qualquer imóvel com manutenção ativa (pendente ou em_progresso) registada,
        // independentemente do status do imóvel ou se tem contrato ativo
        const allInMaintenance = properties.filter((p) => {
          const hasActiveMaint = activeMaintenancePropertyIds.has(Number(p.id));
          // Está em manutenção se tem manutenção ativa registada
          return hasActiveMaint;
        }).length;
        setMaintenanceCount(Number.isFinite(allInMaintenance) ? allInMaintenance : 0);

        // Contar vazios COM manutenção ativa (rolo de pintar):
        // - status=vacant sem contrato ativo E que têm manutenções ativas registadas
        // - status=vacant_soon sem contrato ativo E que têm manutenções ativas registadas
        // - status=maintenance sem contrato ativo (já está em manutenção por definição)
        const vacantInMaintenanceProperties = properties.filter((p) => {
          const hasActiveContract = propertiesWithActiveContracts.has(Number(p.id));
          const statusNormalized = normalizeStatus(p);
          const hasActiveMaint = activeMaintenancePropertyIds.has(Number(p.id));
          
          // Se tem contrato ativo OU status é "rented", não está vazio
          if (hasActiveContract || statusNormalized === 'rented' || statusNormalized === 'becoming_vacant') {
            return false;
          }
          
          const statusIsMaintenance = statusNormalized === 'maintenance';
          const statusIsVacant = statusNormalized === 'vacant' || statusNormalized === 'vacant_soon';
          
          // Está vazio COM manutenção se:
          // 1. status=maintenance sem contrato (já está em manutenção)
          // 2. OU status=vacant/vacant_soon sem contrato E tem manutenção ativa registada
          const isVacantWithMaintenance = (statusIsMaintenance && !hasActiveContract) || (statusIsVacant && !hasActiveContract && hasActiveMaint);
          
          // Debug temporário
          if ((statusIsVacant || statusIsMaintenance) && !hasActiveContract) {
            console.log(`[VacantInMaintenance] Imóvel ${p.id} (${p.name || p.address}): status="${p.status}" normalized="${statusNormalized}" hasContract=${hasActiveContract} hasMaintenance=${hasActiveMaint} isMaintenance=${statusIsMaintenance} isVacant=${statusIsVacant} -> counts=${isVacantWithMaintenance}`);
          }
          
          return isVacantWithMaintenance;
        });
        const vacantInMaintenance = vacantInMaintenanceProperties.length;
        console.log(`[VacantInMaintenance] Total vazios COM manutenção: ${vacantInMaintenance} (IDs: ${vacantInMaintenanceProperties.map(p => p.id).join(', ')})`);
        console.log(`[VacantInMaintenance] activeMaintenancePropertyIds:`, Array.from(activeMaintenancePropertyIds));
        console.log(`[VacantInMaintenance] Total manutenções:`, maintenances.length);
        console.log(`[VacantInMaintenance] Manutenções ativas:`, maintenances.filter(m => isActiveMaintenance(m)).length);
        const finalCount = Number.isFinite(vacantInMaintenance) ? vacantInMaintenance : 0;
        console.log(`[VacantInMaintenance] Definindo vacantInMaintenanceCount = ${finalCount}`);
        setVacantInMaintenanceCount(finalCount);

        // Contar vazios SEM manutenção ativa (casinha):
        // - status=vacant sem contrato ativo E SEM manutenções ativas registadas
        // - status=vacant_soon sem contrato ativo E SEM manutenções ativas registadas
        const vacantProperties = properties.filter((p) => {
          const hasActiveContract = propertiesWithActiveContracts.has(Number(p.id));
          const statusNormalized = normalizeStatus(p);
          const hasActiveMaint = activeMaintenancePropertyIds.has(Number(p.id));
          
          // Se tem contrato ativo OU status é "rented", não está vazio
          if (hasActiveContract || statusNormalized === 'rented' || statusNormalized === 'becoming_vacant') {
            return false;
          }
          
          const statusIsMaintenance = statusNormalized === 'maintenance';
          const statusIsVacant = statusNormalized === 'vacant' || statusNormalized === 'vacant_soon';
          
          // Está vazio SEM manutenção se: status=vacant/vacant_soon E não tem contrato E não é status=maintenance E NÃO tem manutenção ativa
          return statusIsVacant && !statusIsMaintenance && !hasActiveMaint;
        });
        const vacant = vacantProperties.length;
        setVacantCount(Number.isFinite(vacant) ? vacant : 0);

        // Contar imóveis em obras
        const construction = properties.filter((p) => isConstruction(p)).length;
        setConstructionCount(Number.isFinite(construction) ? construction : 0);
      } catch (e) {
        console.error('[App] Erro ao carregar contagens de imóveis:', e);
        if (cancelled) return;
        setMaintenanceCount(0);
        setVacantCount(0);
        setVacantInMaintenanceCount(0);
        setConstructionCount(0);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [activeEntity]);

  // Verificar location.state para definir activeTab (ex: quando vem de um detalhe)
  useEffect(() => {
    if (location.state && typeof location.state === 'object' && 'tab' in location.state) {
      const state = location.state as { tab: string; subTab?: string };
      const tabMap: Record<string, AssetCategory | 'INSURANCE_CLAIMS' | 'INVENTORY_ITEMS' | 'PROPERTY_MAINTENANCES' | 'APPLIANCES' | 'LITIGATIONS'> = {
        'REAL_ESTATE': AssetCategory.REAL_ESTATE,
        'INSURANCE_CLAIMS': 'INSURANCE_CLAIMS',
        'INVENTORY_ITEMS': 'INVENTORY_ITEMS',
        'PROPERTY_MAINTENANCES': 'PROPERTY_MAINTENANCES',
        'APPLIANCES': 'APPLIANCES',
        'LITIGATIONS': 'LITIGATIONS',
      };
      if (state.tab in tabMap) {
        setActiveTab(tabMap[state.tab]);
      }
    }
  }, [location.state]);

  // Sincronizar URL com activeTab (APENAS quando URL muda externamente - não por código)
  useEffect(() => {
    const path = location.pathname;
    
    // Se o path não mudou, não fazer nada
    if (path === lastPathRef.current) {
      return;
    }
    lastPathRef.current = path;

    // Se estamos atualizando programaticamente, ignorar esta execução
    if (isUpdatingFromCode.current) {
      isUpdatingFromCode.current = false;
      return;
    }

    const pathToTabMap: Record<
      string,
      AssetCategory | 'DASHBOARD' | 'ALERTS' | 'SUPER_AGENDA' | 'OPERATIONS' | 'CONTRACTS' | 'REPORTS' | 'INBOX'
    > = {
      '/': 'DASHBOARD',
      '/dashboard': 'DASHBOARD',
      '/contracts': 'CONTRACTS',
      '/reports': 'REPORTS',
      '/alerts': 'ALERTS',
      '/super-agenda': 'SUPER_AGENDA',
      '/operations': 'OPERATIONS',
      '/inbox': 'INBOX',
    };
    
    // Só atualizar se não for uma rota de detalhe (ex: /rental-contracts/:id, /properties/:id, etc)
    // E se não houver location.state definindo a aba
    if (!location.state || (typeof location.state === 'object' && !('tab' in location.state))) {
      if (!path.includes('/rental-contracts/') && !path.includes('/properties/') && 
          !path.includes('/insurance-claims/') && !path.includes('/inventory-items/') &&
          !path.includes('/property-maintenances/') && !path.includes('/appliances/') &&
          !path.includes('/litigations/') &&
          !path.includes('/operations/')) {
        const newTab = pathToTabMap[path];
        if (newTab && newTab !== lastTabRef.current) {
          lastTabRef.current = newTab;
          setActiveTab(newTab);
        }
      }
    }
  }, [location.pathname, location.state]);

  // Sincronizar activeTab com URL (APENAS quando activeTab muda - não por navegação)
  useEffect(() => {
    // Se o tab não mudou, não fazer nada
    if (activeTab === lastTabRef.current) {
      return;
    }
    lastTabRef.current = activeTab;

    // Se estamos atualizando programaticamente, não fazer nada
    if (isUpdatingFromCode.current) {
      return;
    }

    const tabToPathMap: Record<string, string> = {
      DASHBOARD: '/',
      INBOX: '/inbox',
      CONTRACTS: '/contracts',
      REPORTS: '/reports',
      ALERTS: '/alerts',
      SUPER_AGENDA: '/super-agenda',
      OPERATIONS: '/operations',
    };
    
    const path = tabToPathMap[activeTab];
    const currentPath = location.pathname;
    
    if (path && currentPath !== path) {
      isUpdatingFromCode.current = true; // Marcar que estamos atualizando programaticamente
      lastPathRef.current = path; // Atualizar ref antes de navegar
      navigate(path, { replace: true }); // Usar replace: true para não criar histórico desnecessário
    }
  }, [activeTab, navigate, location.pathname]);

  // Conteúdo principal agora é renderizado por `MainRouteContent` no Route "*"

  // Não criar entidade padrão - apenas mostrar mensagem se não houver entidades
  // A entidade padrão com id '0' não existe na base de dados e causa problemas
  
  // Mostrar loading apenas brevemente - mas sempre mostrar Sidebar
  const isLoading = isLoadingEntities;
  const isBackendOffline = backendError === 'BACKEND_OFFLINE';

  return (
    <div className="flex min-h-screen text-neutral-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-6 shrink-0 z-30 shadow-card">
          {/* Left: mobile menu + entity selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-neutral-100 rounded-lg lg:hidden transition-colors text-neutral-500 hover:text-neutral-800"
              title="Menu"
            >
              <Menu size={20} />
            </button>
            <EntitySelector
              currentEntity={activeEntity}
              onEntityChange={(entity) => {
                setActiveEntity(entity);
              }}
              entities={entities}
              onEntityCreated={(newEntity) => {
                setActiveEntity(newEntity);
                refreshEntities();
              }}
              externalShowForm={isEntityFormOpen}
              onExternalShowFormChange={setIsEntityFormOpen}
            />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 md:gap-2">

            {/* Search / Ctrl+K */}
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-sm text-neutral-400 transition-colors w-52 xl:w-64"
              title="Procurar (Ctrl+K)"
            >
              <Search size={15} className="shrink-0" />
              <span className="flex-1 text-left text-xs">Procurar...</span>
              <kbd className="text-[10px] bg-white border border-neutral-200 rounded px-1.5 py-0.5 font-mono text-neutral-400 shadow-sm">Ctrl+K</kbd>
            </button>

            {/* AI Assistant — primary action */}
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 h-8 bg-gradient-to-r from-brand-500 to-violet-600 hover:from-brand-600 hover:to-violet-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-md hover:shadow-brand-500/25 hover:-translate-y-px active:translate-y-0"
            >
              <Sparkles size={13} />
              Assistente IA
            </button>
            {/* Mobile: icon only */}
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="sm:hidden p-2 bg-gradient-to-br from-brand-500 to-violet-600 hover:from-brand-600 hover:to-violet-700 rounded-lg text-white transition-colors"
              title="Assistente IA"
            >
              <Sparkles size={18} />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-neutral-200 mx-1 hidden sm:block" />

            {/* Inbox */}
            <HeaderIconBtn
              onClick={() => setActiveTab('INBOX')}
              title="Inbox / Tarefas"
              badge={inboxBadgeCount}
              badgeColor="bg-blue-500"
            >
              <InboxIcon size={18} />
            </HeaderIconBtn>

            {/* SuperAgenda */}
            <HeaderIconBtn
              onClick={() => setActiveTab('SUPER_AGENDA')}
              title="SuperAgenda (Prazos & Ações)"
              badge={superAgendaBadgeCount}
              badgeColor="bg-emerald-500"
            >
              <CalendarDays size={18} />
            </HeaderIconBtn>

            {/* Alertas */}
            <HeaderIconBtn
              onClick={() => setActiveTab('ALERTS')}
              title="Alertas e Notificações"
              badge={alerts.length}
              badgeColor="bg-danger-500"
            >
              <Bell size={18} />
            </HeaderIconBtn>

            {/* Separator: property status group */}
            <div className="h-6 w-px bg-neutral-200 mx-1 hidden md:block" />

            {/* Manutenção */}
            <HeaderIconBtn
              onClick={() => setActiveTab('PROPERTY_MAINTENANCES')}
              title="Imóveis em Manutenção"
              badge={maintenanceCount}
              badgeColor="bg-warning-500"
              className="hidden md:flex"
            >
              <Wrench size={18} />
            </HeaderIconBtn>

            {/* Vazios em Manutenção */}
            <HeaderIconBtn
              onClick={() => setActiveTab('PROPERTY_VACANCY_MAINTENANCE_MAP')}
              title="Vazios em Manutenção"
              badge={vacantInMaintenanceCount}
              badgeColor="bg-purple-500"
              className="hidden md:flex"
            >
              <Paintbrush size={18} />
            </HeaderIconBtn>

            {/* Imóveis Vazios */}
            <HeaderIconBtn
              onClick={() => {
                navigate('/property-vacancy-maintenance-map', { state: { viewMode: 'vacant' } });
                setActiveTab('PROPERTY_VACANCY_MAINTENANCE_MAP');
              }}
              title="Imóveis Vazios (sem manutenção)"
              badge={vacantCount}
              badgeColor="bg-orange-500"
              className="hidden md:flex"
            >
              <Home size={18} />
            </HeaderIconBtn>

            {/* Obras */}
            <HeaderIconBtn
              onClick={() => setActiveTab(AssetCategory.CONSTRUCTION)}
              title="Imóveis em Obras"
              badge={constructionCount}
              badgeColor="bg-brand-500"
              className="hidden md:flex"
            >
              <Hammer size={18} />
            </HeaderIconBtn>

            {/* User info */}
            <div className="flex items-center gap-2 border-l border-neutral-200 pl-3 ml-1 hidden sm:flex">
              <div className="text-right">
                <p className="text-xs font-semibold leading-none text-neutral-800">{user?.full_name || 'Utilizador'}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wider">{user?.role || 'Viewer'}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-neutral-50">
          {(isLoading || isBackendOffline) ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md animate-fade-in">
                <div className="relative mx-auto mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-100"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-brand-600 absolute top-0 left-0"></div>
                </div>
                <p className="text-neutral-700 font-semibold text-lg mb-2">A carregar dados...</p>
                {isBackendOffline && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-bold mb-2">⚠️ Backend não está a responder</p>
                    <p className="text-sm text-red-700 mb-3">
                      O servidor backend não está a correr ou não está acessível em <code className="bg-red-100 px-2 py-1 rounded">http://127.0.0.1:8000</code>
                    </p>
                    <div className="text-left text-sm text-red-700 space-y-2">
                      <p className="font-semibold">Para resolver:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Certifique-se de que o backend está a correr</li>
                        <li>Verifique se a porta 8000 está livre</li>
                        <li>Execute: <code className="bg-red-100 px-1 rounded">cd backend && python run.py</code></li>
                        <li>Ou use o script: <code className="bg-red-100 px-1 rounded">INICIAR.bat</code></li>
                      </ol>
                      <div className="pt-3">
                        <button
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition"
                          onClick={() => refreshEntities()}
                          title="Tentar ligar novamente ao backend"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {backendError === 'GENERIC' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-bold mb-2">⚠️ Erro ao carregar dados</p>
                    <p className="text-sm text-yellow-700">
                      Verifique o console do navegador (F12) para mais detalhes.
                    </p>
                  </div>
                )}
                {(!backendError && !isBackendOffline) && (
                  <p className="text-sm text-neutral-400 mt-2">A conectar ao servidor...</p>
                )}
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/insurance-claims/:id" element={<InsuranceClaimDetail />} />
              <Route path="/inventory-items/:id" element={<InventoryItemDetail />} />
              <Route path="/property-maintenances/:id" element={<PropertyMaintenanceDetail />} />
              <Route path="/appliances/:id" element={<ApplianceDetail />} />
              <Route path="/litigations/:id" element={<LitigationDetail />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/vehicles/:id" element={<VehicleDetails />} />
              <Route path="/rental-contracts/:id" element={<RentalContractDetail />} />
              <Route path="/deposits/:id" element={<DepositDetail />} />
              <Route path="/operations/:id" element={<OperationDetail />} />
              <Route path="*" element={<MainRouteContent activeTab={activeTab} activeEntity={activeEntity} entities={entities} paletteSearch={paletteSearch} onPaletteSearchConsumed={() => setPaletteSearch(null)} onCreateEntity={() => setIsEntityFormOpen(true)} />} />
            </Routes>
          )}
        </main>
      </div>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        setActiveTab={setActiveTab}
        onNavigateWithSearch={handlePaletteNavigate}
      />

      {/* Assistente IA */}
      {isAIAssistantOpen && (
        <AIAssistant
          entityId={activeEntity ? parseInt(activeEntity.id) : undefined}
          onClose={() => setIsAIAssistantOpen(false)}
          onOpenForm={(intent, form, fields) => {
            setAiFormPending({ intent, form, fields });
            setIsAIAssistantOpen(false);
          }}
        />
      )}

      {/* Forms pré-preenchidos pelo Assistente IA */}
      {aiFormPending && activeEntity && (
        <>
          {aiFormPending.form === 'InsuranceForm' && (() => {
            // Erro no fetch de veículos
            if (aiInsuranceVehiclesError) {
              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full space-y-4">
                    <p className="text-red-600 text-sm font-medium">Erro ao carregar veículos: {aiInsuranceVehiclesError}</p>
                    <button
                      onClick={() => { setAiFormPending(null); setAiInsuranceVehicles(null); setAiInsuranceVehiclesError(null); }}
                      className="w-full px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition text-sm"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              );
            }
            // Loading
            if (aiInsuranceVehicles === null) {
              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-100 border-t-brand-600 mx-auto" />
                    <p className="text-neutral-600 text-sm">A carregar veículos...</p>
                  </div>
                </div>
              );
            }
            // Match de veículo (apenas se 1 resultado inequívoco)
            const hint = String(aiFormPending.fields.vehicle_hint ?? '').toLowerCase();
            let matchedVehicleId = '';
            if (hint && aiInsuranceVehicles.length > 0) {
              const matches = aiInsuranceVehicles.filter((v: any) =>
                v.license_plate?.toLowerCase() === hint ||
                `${v.brand} ${v.model}`.toLowerCase().includes(hint) ||
                hint.includes((v.brand ?? '').toLowerCase()) ||
                hint.includes((v.model ?? '').toLowerCase())
              );
              if (matches.length === 1) matchedVehicleId = String(matches[0].id);
            }
            const insuranceInitialValues = { ...aiFormPending.fields, vehicle_id: matchedVehicleId };
            return (
              <InsuranceForm
                entityId={parseInt(activeEntity.id)}
                vehicles={aiInsuranceVehicles}
                onClose={() => { setAiFormPending(null); setAiInsuranceVehicles(null); }}
                onSuccess={() => { setAiFormPending(null); setAiInsuranceVehicles(null); setActiveTab(AssetCategory.VEHICLE); }}
                initialValues={insuranceInitialValues}
              />
            );
          })()}
          {aiFormPending.form === 'VehicleForm' && (
            <VehicleForm
              entityId={parseInt(activeEntity.id)}
              onClose={() => setAiFormPending(null)}
              onSuccess={() => { setAiFormPending(null); setActiveTab(AssetCategory.ASSET_MANAGEMENT); }}
              initialValues={aiFormPending.fields}
            />
          )}
          {(aiFormPending.form === 'PropertyForm') && (
            <PropertyForm
              entityId={parseInt(activeEntity.id)}
              onClose={() => setAiFormPending(null)}
              onSuccess={() => { setAiFormPending(null); setActiveTab('REAL_ESTATE' as ActiveTab); }}
              initialValues={aiFormPending.fields}
            />
          )}
          {(aiFormPending.form === 'ContractForm') && (
            <ContractForm
              entityId={parseInt(activeEntity.id)}
              onClose={() => setAiFormPending(null)}
              onSuccess={() => { setAiFormPending(null); setActiveTab('CONTRACTS' as ActiveTab); }}
              initialValues={aiFormPending.fields}
            />
          )}
          {aiFormPending.form === 'AlertForm' && (
            <AlertForm
              entityId={parseInt(activeEntity.id)}
              onClose={() => setAiFormPending(null)}
              onSuccess={() => { setAiFormPending(null); setActiveTab('ALERTS' as ActiveTab); }}
              initialValues={aiFormPending.fields}
            />
          )}
          {aiFormPending.form === 'InvestmentForm' && (
            <InvestmentForm
              entityId={parseInt(activeEntity.id)}
              onClose={() => setAiFormPending(null)}
              onSuccess={(_result: InvestmentFormSuccessResult) => {
                setAiFormPending(null);
                setActiveTab(AssetCategory.EQUITY);
              }}
              initialValues={aiFormPending.fields}
            />
          )}
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">A carregar...</div>;
  }

  // Modo individual - sempre mostrar conteúdo, sem login
  return <AppContent />;
};

const AppWithAuth: React.FC = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWithAuth;
