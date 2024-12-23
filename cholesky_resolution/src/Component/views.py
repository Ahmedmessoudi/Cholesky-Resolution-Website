from flask import Blueprint
from Project_algo_Numeric.cholesky_resolution.src.cholescky import solve


views=Blueprint('views',__name__)

@views.route('/')
def home ():
    var = solve()
    return "<h1>",solve,"</h1>"
