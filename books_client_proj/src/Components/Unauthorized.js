import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate("/books");

    return (
        <section>
            <h1>Неавторизованный доступ</h1>
            <br />
            <p>У вас нет прав для доступа к данной странице.</p>
            <div className="flexGrow">
                <button onClick={goBack}>На главную</button>
            </div>
        </section>
    )
}

export default Unauthorized
