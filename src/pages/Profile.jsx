import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, ShieldCheck, Database, Cpu, Users, Clock3 } from 'lucide-react'

// Sesuaikan nilai NIM, kelompok, dan shift jika data praktikan berubah.
const STUDENT_NIM = '21120124130071'
const STUDENT_GROUP = '41'
const STUDENT_SHIFT = '06'

export default function Profile() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center space-y-6">
        {/* Avatar */}
        <div className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-extrabold mx-auto border-4 border-red-100 shadow-md">
          AR
        </div>

        {/* Identity */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Muhamad Ali Rohman</h2>
          <p className="text-gray-500 text-sm mt-1">Teknik Komputer - Universitas Diponegoro</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-left pt-4 border-t border-gray-100">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1">
              <Cpu size={14} /> NIM Lengkap
            </div>
            <p className="text-base font-bold text-gray-800">{STUDENT_NIM}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1">
              <Users size={14} /> Kelompok
            </div>
            <p className="text-base font-bold text-gray-800">{STUDENT_GROUP}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1">
              <Clock3 size={14} /> Shift
            </div>
            <p className="text-base font-bold text-gray-800">{STUDENT_SHIFT}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1">
              <ShieldCheck size={14} /> Praktikum
            </div>
            <p className="text-base font-bold text-gray-800">PPB Modul 5</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1">
              <Database size={14} /> Database
            </div>
            <p className="text-base font-bold text-gray-800">Supabase REST API + localStorage</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1">
              {isOnline ? <Wifi size={14} className="text-green-600" /> : <WifiOff size={14} className="text-amber-600" />} Status Jaringan
            </div>
            <p className={`text-base font-bold ${isOnline ? 'text-green-600' : 'text-amber-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold ${
            isOnline ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
            {isOnline ? 'Mode Online Aktif' : 'Mode Offline Aktif'}
          </div>
        </div>
      </div>
    </div>
  )
}