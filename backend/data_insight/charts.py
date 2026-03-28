import pandas as pd
import plotly.graph_objects as go
from fastapi.responses import HTMLResponse
from db import engine
from sqlalchemy import text

# Disable hover + toolbar in one helper
def fig_to_html(fig):
    """
    This function converts a Plotly figure into an HTML string without hover functionality and toolbar.

    Args:
        fig (Plotly): A Plotly figure object.
    
    Returns:
        str: An HTML string representation of the Plotly figure without hover functionality and toolbar.
    """
    fig.update_layout(hovermode=False)
    for trace in fig.data:
        trace.update(hoverinfo="skip")
    return fig.to_html(include_plotlyjs="cdn", full_html=False,
                       config={"displayModeBar": False}, auto_play=True)

def bar_chart(state: str = "ALL"):
    query = """
    SELECT "Scam_Type", "Complainant_Gender", SUM("Number_of_reports") AS reports
    FROM data_insight
    WHERE (%(state)s = 'ALL' OR "Address_State" = %(state)s)
        AND "Complainant_Age" = '65 and over'
    GROUP BY "Scam_Type", "Complainant_Gender";
    """

    with engine.connect() as conn:
        df = pd.read_sql(query, conn, params={"state": state})

    # Rank scam types by total reports
    top3 = (
        df.groupby("Scam_Type")["reports"]
        .sum()
        .nlargest(3)
        .index
    )
    df_top3 = df[df["Scam_Type"].isin(top3)]

    # Pivot table (Male vs Female counts)
    pivot_df = df_top3.pivot_table(
        index="Scam_Type",
        columns="Complainant_Gender",
        values="reports",
        fill_value=0
    ).reset_index()

    # Add total column for sorting
    pivot_df["total"] = pivot_df.sum(axis=1, numeric_only=True)
    pivot_df = pivot_df.sort_values("total", ascending=False)

    scam_types = pivot_df["Scam_Type"].tolist()
    male_counts = pivot_df.get("Male", pd.Series([0]*len(pivot_df))).tolist()
    female_counts = pivot_df.get("Female", pd.Series([0]*len(pivot_df))).tolist()

    # Start from 0
    fig = go.Figure(data=[
        go.Bar(name="Male", x=scam_types, y=[0]*len(scam_types), marker_color="#1E3A8A"),
        go.Bar(name="Female", x=scam_types, y=[0]*len(scam_types), marker_color="#764ba2")
    ])

    # Build frames (bars grow step by step)
    frames = []
    # steps = 150
    steps = 5
    for step in range(1, steps+1):
        frame_male = [v * step/steps for v in male_counts]
        frame_female = [v * step/steps for v in female_counts]
        frames.append(go.Frame(
            data=[
                go.Bar(name="Male", x=scam_types, y=frame_male, marker_color="#1E3A8A"),
                go.Bar(name="Female", x=scam_types, y=frame_female, marker_color="#764ba2")
            ],
            name=str(step)
        ))
    fig.frames = frames

    # Layout
    fig.update_layout(
        xaxis=dict(
            title=dict(text="Scam Type", font=dict(size=18)),
            tickfont=dict(size=16)
        ),
        yaxis=dict(
            title=dict(text="Reports", font=dict(size=18)),
            tickfont=dict(size=14),
            range=[0, max(male_counts + female_counts) * 1.1]
        ),
        barmode="group",
        bargap=0.25,
        legend=dict(font=dict(size=16)),
        updatemenus=[],
        # updatemenus=[{
        #     "type": "buttons",
        #     "showactive": False,
        #     "buttons": [{
        #         "label": "Play",
        #         "method": "animate",
        #         "args": [None, {
        #             "frame": {"duration": 10, "redraw": True},
        #             "transition": {"duration": 10, "easing": "cubic-in-out"},
        #             "mode": "immediate"
        #         }]
        #     }]
        # }],
        hovermode=False,
        dragmode=False,
        autosize=True
    )

    html = fig_to_html(fig)
    del df, fig

    return HTMLResponse(content=html)


def pie_chart(state: str = "ALL"):
    query = """
    SELECT "Complainant_Gender", COUNT(*) AS count
    FROM data_insight
    WHERE (%(state)s = 'ALL' OR "Address_State" = %(state)s)
        AND "Complainant_Age" = '65 and over'
    GROUP BY "Complainant_Gender";
    """

    with engine.connect() as conn:
        df = pd.read_sql(query, conn, params={"state": state})

    # Build pie chart
    fig = go.Figure(data=[go.Pie(
        labels=df["Complainant_Gender"],
        values=df["count"],
        hole=0.4,  
        textinfo="label+percent",
        insidetextorientation="radial",
        marker=dict(colors=["#764ba2", "#1E3A8A"])
    )])

    # Layout
    fig.update_layout(
        legend=dict(
            title="Gender",
            font=dict(size=16)
        ),
        showlegend=False,
        hovermode=False,
        template=None,
        autosize=True
    )

    html = fig_to_html(fig)
    del df, fig

    return HTMLResponse(content=html)



def line_chart(state: str = "ALL"):
    query = """
    SELECT "Year", SUM("Number_of_reports") / COUNT(DISTINCT "Month") AS avg_reports
    FROM data_insight
    WHERE (%(state)s = 'ALL' OR "Address_State" = %(state)s)
        AND "Complainant_Age" = '65 and over'
    GROUP BY "Year"
    ORDER BY "Year";
    """

    with engine.connect() as conn:
        df = pd.read_sql(query, conn, params={"state": state})

    # Initial trace (first point)
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=[df["Year"].iloc[0]],
        y=[df["avg_reports"].iloc[0]],
        mode="lines+markers",
        line=dict(width=4, color="#1E3A8A"),
        marker=dict(size=10, color="#764ba2")
    ))

    # Frames: gradually add one more year per frame
    frames = []
    for k in range(1, len(df) + 1):
        frames.append(go.Frame(
            data=[go.Scatter(
                x=df["Year"].iloc[:k],
                y=df["avg_reports"].iloc[:k],
                mode="lines+markers",
                line=dict(width=4, color="#667eea"),
                marker=dict(size=10, color="#764ba2")
            )],
            name=str(k)
        ))

    fig.frames = frames

    # Layout
    fig.update_layout(
        xaxis=dict(
            title=dict(text="Year", font=dict(size=20)),
            range=[df["Year"].min()-0.5, df["Year"].max()+0.5]
        ),
        yaxis=dict(
            title=dict(text="Reports", font=dict(size=20)),
            range=[0, df["avg_reports"].max() * 1.1]
        ),
        showlegend=False,
        updatemenus=[],
        # updatemenus=[{
        #     "type": "buttons",
        #     "showactive": False,
        #     "buttons": [{
        #         "label": "Play",
        #         "method": "animate",
        #         "args": [None, {
        #             "frame": {"duration": 600, "redraw": True},
        #             "transition": {"duration": 600, "easing": "cubic-in-out"},
        #             "fromcurrent": True,
        #             "mode": "immediate"
        #         }]
        #     }]
        # }],
        hovermode=False,
        dragmode=False,
        autosize=True
    )

    html = fig_to_html(fig)
    del df, fig
    return HTMLResponse(content=html)
