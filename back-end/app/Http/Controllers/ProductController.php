<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(
            [
                "message" => "Success",
                "data" => Product::latest()->get()
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreProductRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validateData = $request->validate([
            'name' => 'required|max:255',
            'price' => 'required|numeric',
            'quantity' => 'required|numeric',
            'active' => 'required|boolean',
            'description' => 'required'
        ]);

        Product::create($validateData);

        return response()->json(
            [
                "message" => "Create Data Success",
                "data" => $validateData
            ]
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        return response()->json(
            [
                "message" => "Read Data Success",
                "data" => $product
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Product $product)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateProductRequest  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        $validateData = $request->validate([
            'name' => 'max:255',
            'price' => 'numeric',
            'quantity' => 'numeric',
            'active' => 'boolean',
            'description' => ''
        ]);

        Product::where('id', $product->id)->update($validateData);

        return response()->json(
            [
                "message" => "PUT Method Success",
                "data" => $validateData
            ]
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        Product::destroy($product->id);

        return response()->json(
            [
                "message" => "DELETE Method Success"
            ]
        );
    }

    // public function search()
    // {
    //     $query = Product::query();

    //     $query->where('name', 'like', '%' . request('s') . '%')
    //         ->orWhere('description', 'like', '%' . request('s') . '%')
    //         ->orWhere('price', 'like', '%' . request('s') . '%');

    //     return response()->json(
    //         [
    //             "message" => "Search Data Success",
    //             "data" => $query->get()
    //         ]
    //     );
    // }
}
