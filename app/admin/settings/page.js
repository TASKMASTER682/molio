// app/admin/settings/page.js
"use client";

import { useEffect, useState, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`);
      const json = await res.json();
      setSettings(json?.data || json || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    try {
      await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      alert("Settings saved!");
    } catch (e) {
      console.error(e);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleResumeUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large! Max 5MB allowed.");
      return;
    }
    
    setUploading(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      const res = await fetch(`${API_URL}/api/settings/upload-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileData: base64,
          contentType: file.type
        })
      });
      const json = await res.json();
      if (json.success) {
        setSettings(prev => ({ 
          ...prev, 
          resumeUrl: file.name,
          resumeFileName: file.name 
        }));
        alert("Resume uploaded successfully!");
      } else {
        alert("Upload failed: " + json.message);
      }
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="admin-container">
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</p>
      </div>
    );
  }

  const socialPlatforms = [
    { key: 'github', label: 'GitHub', icon: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z' },
    { key: 'linkedin', label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { key: 'twitter', label: 'Twitter/X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
    { key: 'instagram', label: 'Instagram', icon: 'M12 2c2.717 0 2.817.009 3.295.048.477.04.803.09 1.08.192.28.103.503.229.727.454.224.223.35.447.454.727.102.277.152.603.192 1.08.039.478.048.578.048 3.295s-.009 2.817-.048 3.295c-.04.477-.09.803-.192 1.08-.103.28-.229.503-.454.727-.223.224-.447.35-.727.454-.277.102-.603.152-1.08.192-.478.039-.578.048-3.295.048s-2.817-.009-3.295-.048c-.477-.04-.803-.09-1.08-.192-.28-.103-.503-.229-.727-.454-.224-.223-.35-.447-.454-.727-.102-.277-.152-.603-.192-1.08-.039-.478-.048-.578-.048-3.295s.009-2.817.048-3.295c.04-.477.09-.803.192-1.08.103-.28.229-.503.454-.727.223-.224.447-.35.727-.454.277-.102.603-.152 1.08-.192.478-.039.578-.048 3.295-.048M12 5.875a6.125 6.125 0 100 12.25 6.125 6.125 0 000-12.25zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 0 000-2.881z' },
    { key: 'youtube', label: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.867 3.893 12 3.893 12 3.893s-7.867 0-9.377.157A3.015 3.015 0 00.502 6.186C0 8.346 0 12 0 12s0 3.653.502 5.814a3.016 3.016 0 002.122 2.136c1.51.157 9.377.157 9.377.157s7.867 0 9.377-.157a3.015 3.015 0 002.132-2.136C24 15.653 24 12 24 12s0-3.653-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
    { key: 'email', label: 'Email', icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
  ];

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Settings</h1>
        <p>Manage your application settings.</p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Resume/CV Upload */}
        <div className="admin-card">
          <h3 style={{ marginBottom: "1rem", color: "#fff" }}>Resume / CV</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1rem", fontSize: "0.875rem" }}>
            Upload your resume/CV. It will be available for download from the homepage.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              disabled={uploading}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary"
            >
              {uploading ? "Uploading..." : settings?.resumeUrl ? "Replace Resume" : "Upload Resume"}
            </button>
            {settings?.resumeUrl && (
              <a
                href={`${API_URL}/api/settings/resume`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan hover:underline"
                style={{ fontSize: "0.875rem" }}
              >
                View Current Resume
              </a>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-card">
          <h3 style={{ marginBottom: "1rem", color: "#fff" }}>Social Links</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
            These links will appear in the footer of your website.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {socialPlatforms.map(platform => (
              <div key={platform.key}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={platform.icon} />
                  </svg>
                  {platform.label}
                </label>
                <input
                  type="url"
                  value={settings?.socialLinks?.[platform.key] || ''}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    socialLinks: { ...settings.socialLinks, [platform.key]: e.target.value }
                  })}
                  placeholder={`https://${platform.key === 'email' ? 'mailto:' : ''}your-${platform.key}.com/...`}
                  className="admin-input"
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn-primary"
          style={{ alignSelf: "flex-start" }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}