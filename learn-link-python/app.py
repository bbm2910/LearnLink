from flask import Flask, jsonify, request
import matplotlib
matplotlib.use('agg') # Corrects matplotlib main thread error
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objs as go
import io
import base64

app = Flask(__name__)

@app.get("/")
def index():
    return "Welcome to LearnLink's Python data visualisation API!"

@app.post("/current-skills-chart")
def generate_current_skills_visualisation():
    data = request.json

    skills = data.get('skills', [])
    sessions = data.get('learning_sessions', [])

    # Data validation
    if not skills or not sessions or len(skills) != len(sessions):
        return jsonify({'error': 'Invalid data received'}), 400

    # Generate bar chart using matplotlib (static image)
    plt.figure(figsize=(20, 15))
    sns.set_style("white")
    sns.barplot(y=skills, x=sessions, palette='Blues_d')
    plt.title("Skills You've Learned So Far...", fontsize=40)
    plt.xlabel("Number of Sessions")
    plt.ylabel("Skill")

    # Increase label font sizes
    plt.xlabel("Number of Sessions", fontsize=36)
    plt.ylabel("Skill", fontsize=36)
    plt.xticks(fontsize=36)
    plt.yticks(fontsize=36)

    plt.tight_layout()
    plt.show()

    # Generate image & HTML
    img_bytes = io.BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)
    img_base64 = base64.b64encode(img_bytes.getvalue()).decode('utf-8')
    plt.close()

    bar_chart_html = f'<img src="data:image/png;base64,{img_base64}" />'
    return jsonify({'visualisation_html': bar_chart_html})


@app.post("/top-skills-chart")
def generate_top_skills_visualisation():
    data = request.json

    skills = data.get('skills', [])
    learners = data.get('learners', [])

    # Data validation
    if not skills or not learners or len(skills) != len(learners):
        return jsonify({'error': 'Invalid data received'}), 400

    # Generate pie chart
    fig, ax = plt.subplots()
    colors = sns.color_palette("pastel", len(skills))
    ax.pie(learners, labels=skills, autopct='%1.1f%%', startangle=140, colors=colors)
    # ax.set_title("Top Skills Learned by Users")
    ax.axis('equal')

    # Generate image & HTML
    img_bytes = io.BytesIO()
    plt.savefig(img_bytes, format='png', bbox_inches="tight")
    img_bytes.seek(0)
    img_base64 = base64.b64encode(img_bytes.getvalue()).decode('utf-8')
    pie_chart_html = f'<img src="data:image/png;base64,{img_base64}" />'

    return jsonify({'visualisation_html': pie_chart_html})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3005)