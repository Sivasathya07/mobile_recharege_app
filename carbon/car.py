from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import plotly
import plotly.express as px
import plotly.graph_objects as go
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# Carbon emission factors (kg CO2 per unit)
EMISSION_FACTORS = {
    'transport': {
        'car_gasoline': 0.21,  # kg CO2 per km
        'car_diesel': 0.18,
        'car_electric': 0.05,
        'bus': 0.08,
        'train': 0.04,
        'plane': 0.25,
        'motorcycle': 0.11,
        'bicycle': 0,
        'walking': 0
    },
    'food': {
        'beef': 27.0,  # kg CO2 per kg
        'chicken': 6.9,
        'pork': 12.1,
        'fish': 5.0,
        'eggs': 4.8,
        'milk': 3.2,
        'cheese': 13.5,
        'rice': 4.0,
        'wheat': 1.4,
        'vegetables': 2.0,
        'fruits': 1.5
    },
    'energy': {
        'electricity': 0.5,  # kg CO2 per kWh
        'natural_gas': 0.2,  # kg CO2 per kWh
        'heating_oil': 0.27,
        'coal': 0.34
    },
    'household': {
        'water_usage': 0.4,  # kg CO2 per m3
        'waste': 1.5,  # kg CO2 per kg
        'lpg': 2.98  # kg CO2 per kg
    }
}

class CarbonTracker:
    def __init__(self):
        self.init_database()
    
    def init_database(self):
        """Initialize SQLite database"""
        conn = sqlite3.connect('carbon_footprint.db')
        cursor = conn.cursor()
        
        # Create tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                email TEXT,
                city TEXT,
                country TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                activity_type TEXT,
                activity_subtype TEXT,
                value REAL,
                unit TEXT,
                carbon_emission REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                goal_type TEXT,
                target_value REAL,
                current_value REAL DEFAULT 0,
                deadline TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Insert sample community data
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS community_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                city TEXT,
                country TEXT,
                average_footprint REAL,
                data_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insert sample data if empty
        cursor.execute("SELECT COUNT(*) FROM community_data")
        if cursor.fetchone()[0] == 0:
            sample_data = [
                ('New York', 'USA', 240, '2024-01-01'),
                ('London', 'UK', 180, '2024-01-01'),
                ('Tokyo', 'Japan', 220, '2024-01-01'),
                ('Berlin', 'Germany', 190, '2024-01-01'),
                ('Sydney', 'Australia', 260, '2024-01-01'),
                ('Toronto', 'Canada', 230, '2024-01-01'),
                ('Paris', 'France', 170, '2024-01-01'),
                ('Singapore', 'Singapore', 210, '2024-01-01')
            ]
            cursor.executemany(
                "INSERT INTO community_data (city, country, average_footprint, data_date) VALUES (?, ?, ?, ?)",
                sample_data
            )
        
        conn.commit()
        conn.close()
    
    def calculate_carbon_footprint(self, activity_type, subtype, value):
        """Calculate carbon footprint for an activity"""
        if activity_type in EMISSION_FACTORS and subtype in EMISSION_FACTORS[activity_type]:
            return value * EMISSION_FACTORS[activity_type][subtype]
        return 0
    
    def get_user_footprint_summary(self, user_id, days=30):
        """Get user's carbon footprint summary"""
        conn = sqlite3.connect('carbon_footprint.db')
        cursor = conn.cursor()
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        query = """
        SELECT activity_type, SUM(carbon_emission) as total_emission
        FROM activities 
        WHERE user_id = ? AND created_at >= ?
        GROUP BY activity_type
        """
        
        cursor.execute(query, (user_id, start_date))
        results = cursor.fetchall()
        
        total_emission = sum(row[1] for row in results)
        breakdown = {row[0]: row[1] for row in results}
        
        conn.close()
        
        return {
            'total_emission': total_emission,
            'breakdown': breakdown,
            'period_days': days
        }
    
    def get_community_comparison(self, user_city, user_footprint):
        """Compare user's footprint with community average"""
        conn = sqlite3.connect('carbon_footprint.db')
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT average_footprint FROM community_data WHERE city = ? ORDER BY data_date DESC LIMIT 1",
            (user_city,)
        )
        result = cursor.fetchone()
        
        community_avg = result[0] if result else 200  # Default if city not found
        
        conn.close()
        
        comparison = {
            'user_footprint': user_footprint,
            'community_average': community_avg,
            'difference': user_footprint - community_avg,
            'percentage_difference': ((user_footprint - community_avg) / community_avg) * 100
        }
        
        return comparison

class AIInsightsGenerator:
    def __init__(self):
        self.scaler = StandardScaler()
    
    def generate_insights(self, user_data, footprint_data):
        """Generate AI-powered insights for reducing carbon footprint"""
        insights = []
        
        # Analyze transportation patterns
        transport_emission = footprint_data['breakdown'].get('transport', 0)
        if transport_emission > 100:  # High transportation emission
            insights.append({
                'category': 'transport',
                'title': 'Reduce Car Travel',
                'message': f'Your transportation accounts for {transport_emission:.1f} kg CO2. Consider carpooling or using public transportation 2 days a week to reduce emissions by 20%.',
                'impact': 'high',
                'savings_estimate': transport_emission * 0.2
            })
        
        # Analyze food patterns
        food_emission = footprint_data['breakdown'].get('food', 0)
        if food_emission > 50:
            insights.append({
                'category': 'food',
                'title': 'Plant-Based Alternatives',
                'message': f'Your food footprint is {food_emission:.1f} kg CO2. Switching two meat-based meals per week to plant-based alternatives could reduce this by 25%.',
                'impact': 'medium',
                'savings_estimate': food_emission * 0.25
            })
        
        # Analyze energy usage
        energy_emission = footprint_data['breakdown'].get('energy', 0)
        if energy_emission > 40:
            insights.append({
                'category': 'energy',
                'title': 'Energy Efficiency',
                'message': 'Consider upgrading to LED bulbs and using smart power strips. You could reduce energy emissions by 15%.',
                'impact': 'medium',
                'savings_estimate': energy_emission * 0.15
            })
        
        # General insights based on total footprint
        total_emission = footprint_data['total_emission']
        if total_emission > 300:
            insights.append({
                'category': 'general',
                'title': 'High Overall Footprint',
                'message': 'Your carbon footprint is above sustainable levels. Focus on reducing transportation and meat consumption for the biggest impact.',
                'impact': 'high',
                'savings_estimate': total_emission * 0.3
            })
        
        return insights
    
    def predict_footprint_trend(self, historical_data):
        """Predict future footprint trend using simple linear regression"""
        if len(historical_data) < 2:
            return "Insufficient data for trend prediction"
        
        # Simple trend analysis
        emissions = [data['emission'] for data in historical_data]
        trend = "increasing" if emissions[-1] > emissions[0] else "decreasing"
        
        return f"Your carbon footprint shows a {trend} trend over the last {len(historical_data)} weeks."

# Initialize components
tracker = CarbonTracker()
ai_insights = AIInsightsGenerator()

# Routes
@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return redirect(url_for('dashboard'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        
        conn = sqlite3.connect('carbon_footprint.db')
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        
        if not user:
            # Create new user
            cursor.execute(
                "INSERT INTO users (username, email, city, country) VALUES (?, ?, ?, ?)",
                (username, f"{username}@example.com", "Default City", "Default Country")
            )
            conn.commit()
            user_id = cursor.lastrowid
        else:
            user_id = user[0]
        
        conn.close()
        
        session['user_id'] = user_id
        session['username'] = username
        return redirect(url_for('dashboard'))
    
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Carbon Tracker - Login</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            input[type="text"] { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #2e7d32; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        </style>
    </head>
    <body>
        <h2>Carbon Footprint Tracker</h2>
        <form method="POST">
            <div class="form-group">
                <label>Enter your username:</label>
                <input type="text" name="username" required>
            </div>
            <button type="submit">Start Tracking</button>
        </form>
    </body>
    </html>
    '''

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['user_id']
    footprint_data = tracker.get_user_footprint_summary(user_id)
    
    # Create visualizations
    if footprint_data['breakdown']:
        # Pie chart for emission breakdown
        fig_pie = px.pie(
            values=list(footprint_data['breakdown'].values()),
            names=list(footprint_data['breakdown'].keys()),
            title='Carbon Footprint Breakdown'
        )
        pie_chart = json.dumps(fig_pie, cls=plotly.utils.PlotlyJSONEncoder)
        
        # Weekly trend chart (simulated data)
        dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7, 0, -1)]
        weekly_data = [footprint_data['total_emission'] * np.random.uniform(0.8, 1.2) for _ in range(7)]
        
        fig_trend = px.line(
            x=dates, y=weekly_data,
            title='Weekly Carbon Footprint Trend',
            labels={'x': 'Date', 'y': 'CO2 Emissions (kg)'}
        )
        trend_chart = json.dumps(fig_trend, cls=plotly.utils.PlotlyJSONEncoder)
    else:
        pie_chart = trend_chart = None
    
    return render_template('dashboard.html', 
                         footprint_data=footprint_data,
                         pie_chart=pie_chart,
                         trend_chart=trend_chart)

@app.route('/track', methods=['GET', 'POST'])
def track_activity():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        user_id = session['user_id']
        activity_type = request.form.get('activity_type')
        activity_subtype = request.form.get('activity_subtype')
        value = float(request.form.get('value'))
        
        carbon_emission = tracker.calculate_carbon_footprint(
            activity_type, activity_subtype, value
        )
        
        conn = sqlite3.connect('carbon_footprint.db')
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO activities (user_id, activity_type, activity_subtype, value, unit, carbon_emission) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, activity_type, activity_subtype, value, 'unit', carbon_emission)
        )
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'carbon_emission': carbon_emission,
            'message': f'Activity recorded! Carbon emission: {carbon_emission:.2f} kg CO2'
        })
    
    return render_template('track.html', emission_factors=EMISSION_FACTORS)

@app.route('/insights')
def insights():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['user_id']
    footprint_data = tracker.get_user_footprint_summary(user_id)
    
    # Generate AI insights
    user_data = {'user_id': user_id}
    insights = ai_insights.generate_insights(user_data, footprint_data)
    
    return render_template('insights.html', insights=insights)

@app.route('/comparison')
def comparison():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['user_id']
    footprint_data = tracker.get_user_footprint_summary(user_id)
    
    # Get community comparison
    comparison_data = tracker.get_community_comparison(
        "Default City", footprint_data['total_emission']
    )
    
    # Create comparison chart
    fig = go.Figure(data=[
        go.Bar(name='Your Footprint', x=['Carbon Footprint'], y=[comparison_data['user_footprint']]),
        go.Bar(name='Community Average', x=['Carbon Footprint'], y=[comparison_data['community_average']])
    ])
    comparison_chart = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    
    return render_template('comparison.html', 
                         comparison_data=comparison_data,
                         comparison_chart=comparison_chart)

@app.route('/api/footprint_data')
def api_footprint_data():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'})
    
    user_id = session['user_id']
    footprint_data = tracker.get_user_footprint_summary(user_id)
    
    return jsonify(footprint_data)

# HTML Templates
@app.route('/templates/<template_name>')
def serve_template(template_name):
    templates = {
        'dashboard.html': '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Dashboard - Carbon Tracker</title>
            <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                .container { max-width: 1200px; margin: 0 auto; }
                .header { background: #2e7d32; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
                .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px; }
                .card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .carbon-value { font-size: 2em; font-weight: bold; color: #2e7d32; }
                .nav { background: white; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
                .nav a { margin-right: 15px; text-decoration: none; color: #2e7d32; font-weight: bold; }
                .chart-container { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Carbon Footprint Dashboard</h1>
                    <p>Welcome, {{ session.username }}! Track and reduce your environmental impact.</p>
                </div>
                
                <div class="nav">
                    <a href="{{ url_for('dashboard') }}">Dashboard</a>
                    <a href="{{ url_for('track_activity') }}">Track Activity</a>
                    <a href="{{ url_for('insights') }}">AI Insights</a>
                    <a href="{{ url_for('comparison') }}">Comparison</a>
                </div>
                
                <div class="cards">
                    <div class="card">
                        <h3>Total Carbon Footprint</h3>
                        <div class="carbon-value">{{ "%.1f"|format(footprint_data.total_emission) }} kg CO2</div>
                        <p>Last {{ footprint_data.period_days }} days</p>
                    </div>
                    
                    {% for category, emission in footprint_data.breakdown.items() %}
                    <div class="card">
                        <h3>{{ category.title() }} Emissions</h3>
                        <div class="carbon-value">{{ "%.1f"|format(emission) }} kg CO2</div>
                        <p>{{ "%.1f"|format((emission / footprint_data.total_emission) * 100) }}% of total</p>
                    </div>
                    {% endfor %}
                </div>
                
                {% if pie_chart %}
                <div class="chart-container">
                    <div id="pie-chart"></div>
                </div>
                <div class="chart-container">
                    <div id="trend-chart"></div>
                </div>
                
                <script>
                    var pieChart = {{ pie_chart | safe }};
                    Plotly.newPlot('pie-chart', pieChart.data, pieChart.layout);
                    
                    var trendChart = {{ trend_chart | safe }};
                    Plotly.newPlot('trend-chart', trendChart.data, trendChart.layout);
                </script>
                {% else %}
                <div class="card">
                    <h3>No data yet</h3>
                    <p>Start tracking your activities to see your carbon footprint analysis!</p>
                    <a href="{{ url_for('track_activity') }}" style="color: #2e7d32; font-weight: bold;">Track your first activity</a>
                </div>
                {% endif %}
            </div>
        </body>
        </html>
        ''',
        
        'track.html': '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Track Activity - Carbon Tracker</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; }
                .card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .form-group { margin-bottom: 20px; }
                label { display: block; margin-bottom: 5px; font-weight: bold; }
                select, input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
                button { background: #2e7d32; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; }
                .result { margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px; display: none; }
                .nav { background: white; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
                .nav a { margin-right: 15px; text-decoration: none; color: #2e7d32; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="nav">
                    <a href="{{ url_for('dashboard') }}">Dashboard</a>
                    <a href="{{ url_for('track_activity') }}">Track Activity</a>
                    <a href="{{ url_for('insights') }}">AI Insights</a>
                    <a href="{{ url_for('comparison') }}">Comparison</a>
                </div>
                
                <div class="card">
                    <h2>Track Carbon Activity</h2>
                    <form id="activity-form">
                        <div class="form-group">
                            <label>Activity Type</label>
                            <select name="activity_type" id="activity-type" required>
                                <option value="">Select Activity Type</option>
                                <option value="transport">Transportation</option>
                                <option value="food">Food</option>
                                <option value="energy">Energy</option>
                                <option value="household">Household</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Activity Subtype</label>
                            <select name="activity_subtype" id="activity-subtype" required>
                                <option value="">Select Subtype</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Value</label>
                            <input type="number" name="value" step="0.1" required placeholder="Enter value">
                        </div>
                        
                        <button type="submit">Calculate Carbon Footprint</button>
                    </form>
                    
                    <div class="result" id="result"></div>
                </div>
            </div>
            
            <script>
                const emissionFactors = {{ emission_factors | tojson }};
                
                document.getElementById('activity-type').addEventListener('change', function() {
                    const type = this.value;
                    const subtypeSelect = document.getElementById('activity-subtype');
                    subtypeSelect.innerHTML = '<option value="">Select Subtype</option>';
                    
                    if (type && emissionFactors[type]) {
                        for (const [key, value] of Object.entries(emissionFactors[type])) {
                            const option = document.createElement('option');
                            option.value = key;
                            option.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            subtypeSelect.appendChild(option);
                        }
                    }
                });
                
                document.getElementById('activity-form').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const response = await fetch('{{ url_for("track_activity") }}', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    const resultDiv = document.getElementById('result');
                    
                    if (result.success) {
                        resultDiv.style.display = 'block';
                        resultDiv.innerHTML = `
                            <h3>Activity Recorded!</h3>
                            <p>Carbon Emission: <strong>${result.carbon_emission.toFixed(2)} kg CO2</strong></p>
                            <p>${result.message}</p>
                        `;
                        this.reset();
                    }
                });
            </script>
        </body>
        </html>
        ''',
        
        'insights.html': '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>AI Insights - Carbon Tracker</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; }
                .nav { background: white; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
                .nav a { margin-right: 15px; text-decoration: none; color: #2e7d32; font-weight: bold; }
                .insight-card { background: white; padding: 20px; border-radius: 10px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 4px solid #2e7d32; }
                .insight-card.high { border-left-color: #d32f2f; }
                .insight-card.medium { border-left-color: #ff9800; }
                .impact-badge { padding: 3px 8px; border-radius: 12px; color: white; font-size: 0.8em; }
                .impact-high { background: #d32f2f; }
                .impact-medium { background: #ff9800; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="nav">
                    <a href="{{ url_for('dashboard') }}">Dashboard</a>
                    <a href="{{ url_for('track_activity') }}">Track Activity</a>
                    <a href="{{ url_for('insights') }}">AI Insights</a>
                    <a href="{{ url_for('comparison') }}">Comparison</a>
                </div>
                
                <h1>AI-Powered Insights</h1>
                <p>Personalized recommendations to reduce your carbon footprint</p>
                
                {% if insights %}
                    {% for insight in insights %}
                    <div class="insight-card {{ insight.impact }}">
                        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                            <h3 style="margin: 0; flex: 1;">{{ insight.title }}</h3>
                            <span class="impact-badge impact-{{ insight.impact }}">{{ insight.impact.upper() }} IMPACT</span>
                        </div>
                        <p>{{ insight.message }}</p>
                        <p><strong>Estimated savings:</strong> {{ "%.1f"|format(insight.savings_estimate) }} kg CO2</p>
                    </div>
                    {% endfor %}
                {% else %}
                    <div class="insight-card">
                        <h3>No insights yet</h3>
                        <p>Track more activities to get personalized recommendations for reducing your carbon footprint.</p>
                    </div>
                {% endif %}
            </div>
        </body>
        </html>
        ''',
        
        'comparison.html': '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Comparison - Carbon Tracker</title>
            <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; }
                .nav { background: white; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
                .nav a { margin-right: 15px; text-decoration: none; color: #2e7d32; font-weight: bold; }
                .comparison-card { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .stat { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
                .positive { color: #2e7d32; }
                .negative { color: #d32f2f; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="nav">
                    <a href="{{ url_for('dashboard') }}">Dashboard</a>
                    <a href="{{ url_for('track_activity') }}">Track Activity</a>
                    <a href="{{ url_for('insights') }}">AI Insights</a>
                    <a href="{{ url_for('comparison') }}">Comparison</a>
                </div>
                
                <h1>Community Comparison</h1>
                <p>See how your carbon footprint compares to others in your community</p>
                
                <div class="comparison-card">
                    <div id="comparison-chart"></div>
                </div>
                
                <div class="comparison-card">
                    <h3>Your Performance</h3>
                    <div class="stat">
                        <span>Your Carbon Footprint:</span>
                        <strong>{{ "%.1f"|format(comparison_data.user_footprint) }} kg CO2</strong>
                    </div>
                    <div class="stat">
                        <span>Community Average:</span>
                        <strong>{{ "%.1f"|format(comparison_data.community_average) }} kg CO2</strong>
                    </div>
                    <div class="stat">
                        <span>Difference:</span>
                        <strong class="{{ 'positive' if comparison_data.difference < 0 else 'negative' }}">
                            {{ "%+.1f"|format(comparison_data.difference) }} kg CO2
                        </strong>
                    </div>
                    <div class="stat">
                        <span>Percentage Difference:</span>
                        <strong class="{{ 'positive' if comparison_data.percentage_difference < 0 else 'negative' }}">
                            {{ "%+.1f"|format(comparison_data.percentage_difference) }}%
                        </strong>
                    </div>
                </div>
                
                <script>
                    var comparisonChart = {{ comparison_chart | safe }};
                    Plotly.newPlot('comparison-chart', comparisonChart.data, comparisonChart.layout);
                </script>
            </div>
        </body>
        </html>
        '''
    }
    
    return templates.get(template_name, 'Template not found')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)