<template>
  <div class="scam-dashboard-wrapper">
    <div class="scam-dashboard-content">
      <header class="header">
        <h1>Scam Statistics</h1>
        <p>View scam reports for Australians aged 65+ from 2021 to 2025.</p>
      </header>

      <div class="state-selector">
        <label for="state">Select State:</label>
        <select id="state" v-model="selectedState" @change="fetchData">
          <option value="ALL">All States</option>
          <option value="New South Wales">New South Wales</option>
          <option value="Victoria">Victoria</option>
          <option value="Queensland">Queensland</option>
          <option value="Western Australia">Western Australia</option>
          <option value="South Australia">South Australia</option>
          <option value="Tasmania">Tasmania</option>
          <option value="Northern Territory">Northern Territory</option>
        </select>
      </div>

      <div v-if="loading" class="loading">Loading data...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="!loading && !error">
        <section class="summary-section">
          <h2 class="section-title">💰 Top Scam Losses</h2>
          <div class="summary-grid">
            <div
              v-for="scam in scamLoss"
              :key="scam.Scam_Type"
              class="summary-card"
            >
              <h3>{{ scam.Scam_Type }}</h3>
              <div class="value">${{ formatCurrency(scam.Total_Lost) }}</div>
              <div class="label">Total Amount Lost</div>
            </div>
          </div>
        </section>

        <section class="summary-section">
          <h2 class="section-title">📱 Contact Methods</h2>
          <div class="summary-grid">
            <div
              v-for="contact in contactMode"
              :key="contact.Contact_Mode"
              class="summary-card"
            >
              <h3>{{ contact.Contact_Mode }}</h3>
              <div class="value">{{ formatNumber(contact.Reports) }}</div>
              <div class="label">Total Reports</div>
            </div>
          </div>
        </section>

        <section class="charts-section">
          <div class="chart-container">
            <h3 class="chart-title">📈 Scam Reports Trend Over Time</h3>
            <iframe
              :src="`${apiBaseUrl}/charts/line?state=${selectedState}`"
              style="width:100%; height:400px; border:none;"
            ></iframe>
          </div>

          <div class="chart-container">
            <h3 class="chart-title">🥧 Scam Victims by Gender</h3>
            <iframe
              :src="`${apiBaseUrl}/charts/pie?state=${selectedState}`"
              style="width:100%; height:400px; border:none;"
            ></iframe>
          </div>

          <div class="chart-container">
            <h3 class="chart-title">📊 Top 3 Scam Types by Gender</h3>
            <iframe
              :src="`${apiBaseUrl}/charts/bar?state=${selectedState}`"
              style="width:100%; height:400px; border:none;"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
const API_BASE_URL = import.meta.env.VITE_API_DATA_URL

export default {
  name: "App",
  data() {
    return {
      selectedState: "ALL",
      scamLoss: [],
      contactMode: [],
      loading: true,
      error: null,
      apiBaseUrl: API_BASE_URL
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;

      try {
        const [scamLossRes, contactModeRes] = await Promise.all([
          fetch(`${this.apiBaseUrl}/summary/scam_loss?state=${this.selectedState}`),
          fetch(`${this.apiBaseUrl}/summary/contact_mode?state=${this.selectedState}`),
        ]);

        if (!scamLossRes.ok) throw new Error("Failed to fetch scam loss data");
        if (!contactModeRes.ok) throw new Error("Failed to fetch contact mode data");

        this.scamLoss = await scamLossRes.json();
        this.contactMode = await contactModeRes.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-AU", { minimumFractionDigits: 0 }).format(value);
    },
    formatNumber(value) {
      return new Intl.NumberFormat("en-AU").format(value);
    },
  },
};
</script>

<style>
/* Global styles - will only apply when this component is loaded */
body, html {
  margin: 0 !important;
  padding: 0 !important;
}

#app {
  margin: 0 !important;
  padding: 0 !important;
}
</style>

<style scoped>
.scam-dashboard-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: white;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.scam-dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 48px;
}

.header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16px;
  line-height: 1.2;
}

.header p {
  font-size: 1.125rem;
  color: #4b5563;
  line-height: 1.75;
  max-width: 48rem;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .header h1 {
    font-size: 2.5rem;
  }

  .header p {
    font-size: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .header h1 {
    font-size: 3rem;
  }
}

.state-selector {
  background: #dbeafe;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.state-selector label {
  font-weight: 600;
  color: #1e40af;
  margin-right: 15px;
  font-size: 1.1rem;
}

.state-selector select {
  padding: 10px 20px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  background: white;
  color: #333;
  transition: all 0.3s ease;
}

.state-selector select:hover {
  border-color: #1e40af;
}

.summary-section {
  margin-bottom: 30px;
}

.section-title {
  color: #1e40af;
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.summary-card {
  background: #dbeafe;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.summary-card h3 {
  color: #1e40af;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.summary-card .value {
  color: #1e40af;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.summary-card .label {
  color: #3b82f6;
  font-size: 0.95rem;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.chart-container {
  /* background: #dbeafe; */
  padding: 25px;
  border-radius: 12px;
  border: 4px solid #3b82f6;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  min-height: 500px;
}

.chart-title {
  color: #1e40af;
  font-size: 1.3rem;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
}

.loading {
  text-align: center;
  color: #1e40af;
  padding: 40px;
  font-size: 1.2rem;
}

.error {
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.8rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
