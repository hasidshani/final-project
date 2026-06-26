type StatCardProps = {
    icon: string;
    count: number;
    label: string;
    iconBg?: string;
};

function StatCard({ icon, count, label, iconBg = '#f0f0f0' }: StatCardProps) {
    return (
        <div className="card text-center border-0 shadow-sm h-100">
            <div className="card-body py-4">
                <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: 56, height: 56, background: iconBg, fontSize: '1.4rem' }}
                >
                    {icon}
                </div>
                <div className="display-6 fw-bold mb-1">{count}</div>
                <p className="text-muted small mb-0">{label}</p>
            </div>
        </div>
    );
}

export default StatCard;
