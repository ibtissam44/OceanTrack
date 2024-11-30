<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        try {
      
         

            $products = Product::all();
            return response()->json($products);
        } catch (\Exception $e) {
            Log::error('Error fetching products: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch products'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
   
          

        
            $validated = $request->validate([
                'productName' => 'required|string|max:255',
                'color' => 'required|string|max:100',
                'category' => 'required|string|max:100',
                'price' => 'required|numeric|min:0',
            ]);

       
            $product = Product::create($validated);

       
           

            return response()->json($product, 201);
        } catch (\Exception $e) {
       
            Log::error('Error creating product: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create product'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
          
          

       
            $product = Product::findOrFail($id);

        
            $validated = $request->validate([
                'productName' => 'required|string|max:255',
                'color' => 'required|string|max:100',
                'category' => 'required|string|max:100',
                'price' => 'required|numeric|min:0',
            ]);

    
            $product->update($validated);


        

            return response()->json($product, 200);
        } catch (\Exception $e) {
         
            Log::error('Error updating product: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update product'], 500);
        }
    }

    public function destroy($id)
    {
        try {
     
       

      
            $product = Product::findOrFail($id);

     
            $product->delete();


           

            return response()->json(['message' => 'Product deleted successfully'], 200);
        } catch (\Exception $e) {
    
            Log::error('Error deleting product: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete product'], 500);
        }
    }
}
